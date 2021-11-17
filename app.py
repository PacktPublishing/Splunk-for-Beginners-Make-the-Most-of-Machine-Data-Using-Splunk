from flask import Flask, render_template, jsonify, request
from splunklib import client, results
import os

SPLUNK_TOKEN = os.environ['SPLUNK_JWT']
splunk_service = client.connect(host=os.environ['SPLUNK_HOST'], port=os.environ['SPLUNK_PORT'],
                                splunkToken=SPLUNK_TOKEN)

app = Flask(__name__, template_folder='web/templates', static_folder='web/static')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/client-locations')
def client_locations():
    query = 'search buttercupgames | ' \
            'iplocation clientip lang=code | ' \
            'stats count as "z" by Country'
    return perform_query(query=query)


@app.route('/location-actions')
def location_actions():
    query = 'search buttercupgames  | ' \
            'iplocation clientip lang=code | ' \
            'where Country="{0}" | ' \
            'stats count as "y" by action | ' \
            'rename action as "name"'.format(request.args.get("country"))
    return perform_query(query=query)


@app.route('/request-count')
def request_count():
    query = 'search buttercupgames | ' \
            'timechart span=1h count as "y" | ' \
            'rename _time as "x"'
    return perform_query(query=query)


def perform_query(query):
    result = results.ResultsReader(splunk_service.jobs.oneshot(query, count=0))
    return jsonify(list(result))
