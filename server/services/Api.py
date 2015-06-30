__author__ = 'almclean'

import os
import requests as r
import json


class Api(object):
    """ Controls low level access to the Rest end point on Neo"""

    def __init__(self, connection_url=None):
        """
        :param connection_url: Connection url of DB Rest endpoint
        :return: new Api object
        """
        if connection_url is None:
            self.connection_url = os.environ['DB_REST_ENDPOINT']
        else:
            self.connection_url = connection_url

    def get_non_admin_labels(self):
        """Gets labels from the db for non-admin nodes"""
        cypher = "\n".join([
            'MATCH (n)-[r]-(m)',
            'WHERE NOT has(r.admin)',
            'RETURN distinct type(r) as r'
        ])
        return self.query(cypher)

    def get_non_admin_relationships(self):
        cypher = "\n".join([
            'MATCH (n)-[r]-(m)',
            'WHERE NOT has(r.admin)',
            'RETURN distinct type(r) as r'
        ])
        return self.query(cypher)

    def get_meta_data(self):
        """Returns a json object consisting of the non-admin labels and relationships in the db"""
        ret_val = {'labels': self.get_non_admin_labels(), 'relationships': self.get_non_admin_relationships()}
        return json.dump(ret_val)

    def query(self, cypher, parameters=None):
        """
        :param cypher: Single string or list of cypher commands to send to Neo
        :return: JSON data from server otherwise throw
            (http://docs.python-requests.org/en/latest/user/quickstart/#errors-and-exceptions)
        """
        headers = {"Content-Type": "application/json",
                   "Accept": "application/json; charset=UTF-8"
                   }

        data = {"statements": []}

        # Work out if this is a list of cypher strings or not.
        if self.__is_sequence__(cypher):
            for query_string in cypher:
                data["statements"].append(
                    {"statement": query_string})
        else:
            data["statements"] = {"statement": cypher, "parameters": parameters}

        resp = r.post(self.connection_url, headers=headers, data=json.dumps(data))
        if resp.status_code is 200:
            return resp.json()
        else:
            resp.raise_for_status()

    def __is_sequence__(self, arg):
        return (not hasattr(arg, "strip") and
                hasattr(arg, "__getitem__") or
                hasattr(arg, "__iter__"))
