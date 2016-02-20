# endpoints.py
"""Module containing API endpoints.
"""


import random
import string

from bson import json_util
from bson.objectid import ObjectId
from flask import jsonify, make_response, request, send_from_directory, g
from flask.ext.httpauth import HTTPBasicAuth
import pymongo
import urllib

from paratureanalytics import app
from paratureanalytics.config import MONGO_URI, MONGO_DB_NAME, UPLOAD_FOLDER
from paratureanalytics.models import User, AuthToken
from paratureanalytics.query import QueryBuilder
from paratureanalytics.utils import process_query_results, process_document, make_excel_file


auth = HTTPBasicAuth()
db = pymongo.MongoClient(MONGO_URI)[MONGO_DB_NAME]


@app.route('/api/v1/action', methods=['OPTIONS', 'GET'])
@auth.login_required
def get_action_resource():
    """Return action resource records"""
    if request.method == 'OPTIONS':
        return make_api_response()

    qb = QueryBuilder(request.args)
    if qb.query_type == 'aggregate':
        query_cursor = db.action.aggregate(qb.get_query())
        data = [elem for elem in query_cursor]
    else:
        query_cursor = db.action.find(qb.get_query()).sort('timestamp', pymongo.DESCENDING)
        data = process_query_results(query_cursor, 'action')

    query_string = urllib.urlencode(request.args)
    uri = '/api/v1/action?' + query_string

    response_data = {
        'uri': uri,
        'type': qb.query_type,
        'total': len(data),
        'results': data
    }

    return make_api_response(json_util.dumps(response_data))


@app.route('/api/v1/action/<actionid>', methods=['OPTIONS', 'GET'])
@auth.login_required
def get_action_item(actionid):
    """Return action resource record"""
    if request.method == 'OPTIONS':
        return make_api_response()

    query_cursor = db.action.find_one({'_id': ObjectId(actionid)})
    data = process_document(query_cursor, 'action')

    return make_api_response(json_util.dumps(data))


@app.route('/api/v1/action/type', methods=['OPTIONS', 'GET'])
@auth.login_required
def get_action_types():
    """Return types of action resource"""
    if request.method == 'OPTIONS':
        return make_api_response()

    data = db.action.distinct('actionType')

    response_data = {
        'uri': '/api/v1/action/type',
        'total': len(data),
        'results': sorted(data)
    }

    return make_api_response(json_util.dumps(response_data))


@app.route('/api/v1/action/csr', methods=['OPTIONS', 'GET'])
@auth.login_required
def get_action_csrs():
    """Return csrs attached to action resource"""
    if request.method == 'OPTIONS':
        return make_api_response()

    data = db.action.distinct('assignedTo')

    response_data = {
        'uri': '/api/v1/action/csr',
        'total': len(data),
        'results': sorted(data)
    }

    return make_api_response(json_util.dumps(response_data))


@app.route('/api/v1/action/download', methods=['OPTIONS', 'GET'])
@auth.login_required
def create_download_file():
    """Create Excel file from action resource records and return URI to file"""
    if request.method == 'OPTIONS':
        return make_api_response()

    qb = QueryBuilder(request.args)
    if qb.query_type == 'aggregate':
        query_cursor = db.action.aggregate(qb.get_query())
        data = [elem for elem in query_cursor]
    else:
        query_cursor = db.action.find(qb.get_query()).sort('timestamp', pymongo.DESCENDING)
        data = process_query_results(query_cursor, 'action')

    username = g.user.username
    filename = username + ''.join(random.choice(string.ascii_uppercase + string.digits) for x in xrange(16))

    make_excel_file(filename, data)

    token = AuthToken.generate(filename)
    urlsafe_token = urllib.quote(token)
    tempDownloadUri = request.base_url + '/report.xlsx?fileToken=' + urlsafe_token

    return make_api_response(json_util.dumps({'file_token': tempDownloadUri}))


@app.route('/api/v1/action/download/report.xlsx', methods=['GET'])
def get_download_file():
    """Return URI for action resource download file"""
    file_token = request.args.get('fileToken')
    token = urllib.unquote(file_token)

    filename = AuthToken.verify(token)
    if filename:
        full_filename = filename + '.xlsx'
        return send_from_directory(directory=UPLOAD_FOLDER, filename=full_filename)

    return jsonify({'error': 'File download token expired or an error occurred!'})


@app.route('/api/v1/token', methods=['OPTIONS', 'POST'])
@auth.login_required
def create_auth_token():
    """Create and return authentication token"""
    if request.method == 'OPTIONS':
        return make_api_response()

    token = g.user.generate_auth_token()

    return make_api_response(json_util.dumps({'token': token.decode('ascii')}))


@auth.verify_password
def verify_password(username_or_token, password):
    """Flask httpauth ext - Verify HTTP Basic authentication credentials"""
    #Try to see if it's a token first
    username = User.verify_auth_token(username_or_token)

    if username:
        query = {
            'username': username
        }
        user = db.user.find_one(query)
        user = User(user['username'], pw_hash=user['password'])
    else:
        query = {
            'username': username_or_token
        }
        user = db.user.find_one(query)

        if not user:
            return False
        user = User(user['username'], pw_hash=user['password'])
        if not user.check_password(password):
            return False

    g.user = user
    return True


@auth.error_handler
def unauthorized():
    """Return unauthorized response"""
    data = (jsonify({'error': 'Unauthorized access'}), 403)

    return make_api_response(data)


@app.errorhandler(404)
def page_not_found(e):
    """Flask builtin - Custom 404 error response"""
    return make_response(jsonify({'error': 'No endpoint exists for path given'}), 404)


@app.errorhandler(500)
def application_error(e):
    """Flask builtin - Custom 500 error response"""
    return make_response(jsonify({'error': 'The server encountered an error'}), 500)


def make_api_response(data=None):
    """Return Flask response object with appropriate headers"""
    if data:
        response = make_response(data)
    else:
        response = make_response()

    response.headers['Content-type'] = 'application/json'
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Authorization'

    return response
