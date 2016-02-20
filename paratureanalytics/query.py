# query.py
"""Module contains classes to manage build query documents from request query
parameters.
"""


from datetime import datetime
import urllib


class QueryBuilder(object):
    """Class handles building of MongoDB queries based on request parameters"""
    def __init__(self, parameters):
        self.parameters = self._parse_parameters(parameters)
        self.query_type = self._determine_query_type(parameters)

    def _parse_parameters(self, parameters):
        """Return dict with vals converted to appropriate type"""
        params = parameters.to_dict()

        for key, val in params.iteritems():
            params[key] = urllib.unquote_plus(urllib.unquote(val))

        if 'dateMin' in params:
            params['dateMin'] = datetime.strptime(params['dateMin'], '%Y-%m-%d')
        if 'dateMax' in params:
            params['dateMax'] = datetime.strptime(params['dateMax'], '%Y-%m-%d')

        return params

    def _determine_query_type(self, parameters):
        """Return type of query needed based on query parameters"""
        if 'groupBy' in parameters:
            return 'aggregate'
        else:
            return 'standard'

    def _build_aggregate_query(self):
        """Return MongoDB query document for aggregate query"""
        agg_query = [ { '$sort' : { 'timestamp' : 1 } } ]

        match_document = self._build_match_document()
        if match_document:
            agg_query.append(match_document)

        project_document = self._build_project_documet()
        if project_document:
            agg_query.append(project_document)

        group_document = self._build_group_document()
        if group_document:
            agg_query.append(group_document)

        return agg_query

    def _build_match_document(self):
        """Return MongoDB aggregation match document for dateMin dateMax keys"""
        date_min = self.parameters.get('dateMin', None)
        date_max = self.parameters.get('dateMax', None)
        action_type = self.parameters.get('actionType', None)
        ticket_number = self.parameters.get('ticketNumber', None)
        assigned_to = self.parameters.get('assignedTo', None)
        assigned_from = self.parameters.get('assignedFrom', None)

        match_document = { '$match' : {} }

        if date_min and date_max:
            match_document['$match']['timestamp'] = { '$gte' : date_min, '$lte' : date_max }
        elif date_min and not date_max:
            match_document['$match']['timestamp'] = { '$gte' : date_min }
        elif date_max and not date_min:
            match_document['$match']['timestamp'] = { '$lte' : date_max }

        if action_type:
            match_document['$match']['actionType'] = action_type

        if ticket_number:
            match_document['$match']['ticketNumber'] = ticket_number

        if assigned_to:
            match_document['$match']['assignedTo'] = assigned_to

        if assigned_from:
            match_document['$match']['assignedFrom'] = assigned_from

        return match_document

    def _build_project_documet(self):
        """Return a MongoDB aggregration project document"""
        group_by = self.parameters.get('groupBy', None)

        project_document = { '$project' : {} }

        if group_by == 'day':
            project_document['$project']['dateStr'] = { '$dateToString': { 'format': "%m-%d-%Y", 'date': "$timestamp" } }
        elif group_by == 'month':
            project_document['$project']['dateStr'] = { '$dateToString': { 'format': "%m-%Y", 'date': "$timestamp" } }
        else:
            return None

        return project_document

    def _build_group_document(self):
        """Return a MongoDB aggregation group document for type keys"""
        group_by = self.parameters.get('groupBy', None)

        if group_by == 'type':
            group_document = { '$group': { '_id': '$actionType',  'count': { '$sum' : 1 } } }
        elif group_by == 'assigned_to':
            group_document = { '$group': { '_id': '$assignedTo',  'count': { '$sum' : 1 } } }
        elif group_by == 'assigned_from':
            group_document = { '$group': { '_id': '$assignedFrom',  'count': { '$sum' : 1 } } }
        elif group_by == 'ticket':
            group_document = { '$group': { '_id': '$ticketNumber',  'count': { '$sum' : 1 } } }
        elif group_by in ['day', 'month']:
            group_document = { '$group' : { '_id': '$dateStr', 'count': {'$sum': 1 } } }
        else:
            return None

        return group_document

    def _build_standard_query(self):
        """Return MongoDB query document for standard query"""
        date_min = self.parameters.get('dateMin', None)
        date_max = self.parameters.get('dateMax', None)

        query_document = self.parameters

        if 'dateMin' in query_document:
            del query_document['dateMin']
            query_document['timestamp'] = {'$gte': date_min}

        if 'dateMax' in query_document:
            del query_document['dateMax']

            if 'timestamp' in query_document:
                query_document['timestamp']['$lte'] = date_max
            else:
                query_document['timestamp'] = {'$lte': date_max}

        return query_document

    def get_query(self):
        """Return MongoDB query document based on request parameters"""
        if self.query_type == 'aggregate':
            query = self._build_aggregate_query()
        else:
            query = self._build_standard_query()

        return query
