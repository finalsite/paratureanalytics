"""Module containing views for application.
"""


from flask import Flask, render_template
from . import app


@app.route('/login', methods=['GET'])
def get_login():
    return render_template('login.html')


@app.route('/', methods=['GET'])
def get_root():
    return render_template('index.html')


@app.route('/reports', methods=['GET'])
def get_report():
    return render_template('reports.html')


@app.route('/explore', methods=['GET'])
def get_explore():
    return render_template('explore.html')
