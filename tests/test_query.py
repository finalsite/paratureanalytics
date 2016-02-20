# test_query.py
"""Module containing tests for the QueryBuilder class.
"""


from datetime import datetime
from unittest import TestCase, main

from werkzeug.datastructures import MultiDict

from paratureanalyticsapi.query import QueryBuilder


class QueryBuilderTestCase(TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_instance_variable_parameters(self):
        """Test that class has instance variable parameters"""
        params = MultiDict([('a', 'b'), ('a', 'c')])
        qb = QueryBuilder(params)

        expected_param_type = type({})
        actual_param_type = type(qb.parameters)

        self.assertEqual(expected_param_type, actual_param_type)

    def test_instance_variable_query_type(self):
        """Test that class has instance variable query_type"""
        params = MultiDict([('a', 'b'), ('a', 'c')])
        qb = QueryBuilder(params)

        self.assertIsNotNone(qb.query_type)

    def test_method_determine_query_type(self):
        """Test that method determines query type based on query parameters"""
        params = MultiDict([('groupBy', 'type')])
        qb = QueryBuilder(params)

        actual_query_type = qb._determine_query_type(params)
        expected_query_type = 'aggregate'

        self.assertEqual(actual_query_type, expected_query_type)

    def test_method_get_query(self):
        """Test that method returns a dict representing a MongoDB query"""
        params = MultiDict([('groupBy', 'type')])
        qb = QueryBuilder(params)

        self.assertIsInstance(qb.get_query(), list)

    def test_method_build_aggregate_query(self):
        """Test that method returns a dict representing a MongoDB aggregate query"""
        params = MultiDict([('groupBy', 'type')])
        qb = QueryBuilder(params)

        self.assertIsInstance(qb.get_query(), list)

    def test_method_build_standard_query(self):
        """Test that method returns a dict representing a MongoDB standard query"""
        params = MultiDict([('type', '1 Star Ticket Rating')])
        qb = QueryBuilder(params)

        self.assertIsInstance(qb.get_query(), dict)

    def test_method_parse_parameters(self):
        """Test that method converts query fields to appropriate types"""
        params = MultiDict([('groupBy', 'type'), ('dateMin', '12/01/2015'), ('dateMax', '12/31/2015')])
        qb = QueryBuilder(params)

        self.assertIsInstance(qb.parameters['dateMin'], datetime)
        self.assertIsInstance(qb.parameters['dateMax'], datetime)

    def test_method_build_match_document(self):
        """Test that method builds a dict representing a MongoDB aggregation match docment"""
        params = MultiDict([('groupBy', 'type'), ('dateMin', '12/01/2015'), ('dateMax', '12/31/2015')])
        qb = QueryBuilder(params)

        match_document = qb._build_match_document()

        self.assertIsInstance(match_document, dict)

    def test_method_build_group_document(self):
        """Test that method build a dict representing a MongoDB aggregation group document"""
        params = MultiDict([('groupBy', 'type'), ('dateMin', '12/01/2015'), ('dateMax', '12/31/2015')])
        qb = QueryBuilder(params)

        group_document = qb._build_group_document()

        self.assertIsInstance(group_document, dict)

    def test_method_build_project_document(self):
        """Test that method builds a dict representing a MongoDB aggregation project document"""
        params = MultiDict([('groupBy', 'day'), ('dateMin', '12/01/2015'), ('dateMax', '12/31/2015')])
        qb = QueryBuilder(params)

        project_document = qb._build_project_documet()

        self.assertIsInstance(project_document, dict)


if __name__ == '__main__':
    main()
