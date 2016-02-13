from flask import Flask


app = Flask(__name__, static_url_path='', static_folder='static')

app.config.from_pyfile('config.py')


from . import controller
