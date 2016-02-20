"""Module contains miscellaneous utility functions used in
application.
"""


from datetime import datetime

import pymongo
import xlsxwriter

from paratureanalytics.config import UPLOAD_FOLDER, MONGO_URI, MONGO_DB_NAME, UPLOAD_FOLDER
from paratureanalytics.models import User


def process_query_results(query_cursor, resource_type=None):
    """Return dictionary of documents from MongoDB cursor"""
    results = []
    for document in query_cursor:
        doc = process_document(document, resource_type)
        results.append(doc)

    return results


def process_document(document, resource_type):
    """Return JSON ready document"""
    document_id = convert_bson_id_to_str(document['_id'])
    del document['_id']

    if resource_type == 'action':
        document['uri'] = generate_action_uri(document_id)

    if 'timestamp' in document:
        document['timestamp'] = convert_datetime_to_str(document['timestamp'])

    return document


def convert_bson_id_to_str(bson_id):
    """Convert MongoDB BSON id to a string"""
    return str(bson_id)


def convert_datetime_to_str(datetime_obj):
    """Convert datetime to string timestamp"""
    return datetime_obj.strftime("%Y-%m-%d %H:%M:%S")


def generate_action_uri(document_id):
    """Return URI for action document"""
    return '/api/v1/action/' + document_id


def make_excel_file(filename, data):
    """Write dictionary to excel file"""
    workbook = xlsxwriter.Workbook(UPLOAD_FOLDER + filename + '.xlsx')
    worksheet = workbook.add_worksheet()

    row = 0
    for document in data:
        col = 0
        if row == 0:
            for key, value in document.iteritems():
                worksheet.write(row, col, key)
                col += 1
            row += 1
            col = 0

        for key, value in document.iteritems():
            worksheet.write(row, col, value)
            col += 1
        row += 1

    workbook.close()


def create_user(username, password):
    """Create user and add to database"""
    db = pymongo.MongoClient(MONGO_URI)[MONGO_DB_NAME]
    user = User(username, password)

    user_id = db.user.insert_one(user.serialize).inserted_id
