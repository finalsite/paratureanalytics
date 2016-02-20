# test_utils.py
"""Module containing tests for the utils module.
"""


from datetime import datetime
from unittest import TestCase, main

import pymongo

from paratureanalyticsapi.utils import (
    build_query_document, create_groupby_query, get_date_tuple_from_str,
    convert_to_datetime, get_as_datetime, convert_bson_id_to_str,
    convert_datetime_to_str, generate_action_uri
)
from tests.config import MONGO_URI, TEST_DB_NAME


db = pymongo.MongoClient(MONGO_URI)[TEST_DB_NAME]


class UtilsTestCase(TestCase):
    def setUp(self):
        db.action.insert({'timestamp': datetime.now()})
        self.query_cursor = db.action.find_one()

    def tearDown(self):
        db.action.delete_many({})
        self.query_cursor = None

    def test_convert_bson_id_to_str(self):
        """Test that BSON _id field of document is converted to a str"""
        document = self.query_cursor
        document_id = document['_id']

        str_id = convert_bson_id_to_str(document_id)

        self.assertIsInstance(str_id, str)

    def test_convert_datetime_to_str(self):
        """Test that datetime is converted to a string"""
        document = self.query_cursor

        document_timestamp = document['timestamp']

        timestamp_str = convert_datetime_to_str(document_timestamp)

        self.assertIsInstance(timestamp_str, str)

    def test_generate_action_uri(self):
        """Test that valid URI is created for an action document"""
        document = self.query_cursor
        document_id = convert_bson_id_to_str(document['_id'])

        uri = generate_action_uri(document_id)

        self.assertTrue('/api/v1/action' in uri)

    def test_build_query_document_basic_params(self):
        """Test that function correctly builds query document"""
        query_params = {
            'type': '1 Star Ticket Rating',
            'assignedTo': 'Joel Colucci',
            'assignedFrom': 'Pauline Chin',
            'ticketNumber': 8430717,
            'dateMin': '01/05/2015',
            'dateMax': '06/19/2015'
        }
        expected_query = {
            'type': '1 Star Ticket Rating',
            'assignedTo': 'Joel Colucci',
            'assignedFrom': 'Pauline Chin',
            'ticketNumber': 8430717,
            'timestamp': {
                '$lte': datetime(2015, 6, 19),
                '$gte': datetime(2015, 1, 5)
            }
        }

        query_doc = build_query_document(query_params)

        self.assertEqual(query_doc, expected_query)

    def test_convert_to_datetime(self):
        """Test that method returns a datetime object"""
        time_param = convert_to_datetime((2015, 1, 5))

        expected_time = datetime(2015, 1, 5)

        self.assertEqual(time_param, expected_time)

    def test_get_date_tuple_from_str(self):
        """Test that method returns a tuple representing (year, month, day)"""
        time_tuple = get_date_tuple_from_str('1/05/2015')

        expected_tuple = (2015, 1, 5)

        self.assertEqual(time_tuple, expected_tuple)

    def test_create_groupby_query(self):
        """Test that method returns valid MongoDB aggregate query"""
        parameters = {}
        query = create_groupby_query(parameters)

        self.assertIsNotNone(query)


if __name__ == '__main__':
    main()
