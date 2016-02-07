"""Module containing code to launch Flask app.
"""


from paratureanalyticsdashboard import app


app.run(port=8000, threaded=True)
