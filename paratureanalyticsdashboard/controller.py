"""Module containing controllers for application.
"""


from flask import Flask, render_template, request, redirect, jsonify

from . import app


@app.route('/', methods=['GET'])
def get_root():
    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def handle_log():
    return render_template('login.html')
