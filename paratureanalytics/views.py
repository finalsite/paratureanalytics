"""Module containing controllers for application.
"""


from flask import Flask, render_template
from . import app


@app.route('/', methods=['GET'])
def get_root():
    return render_template('index.html')


@app.route('/login', methods=['GET'])
def get_login():
    return render_template('login.html')
