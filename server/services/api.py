__author__ = 'almclean'

import os
import requests as r
import json


class Api(object):
    """ Controls low level access to the Rest end point on Neo"""

    def __init__(self, connection_url=os.environ['DB_REST_ENDPOINT']):
        """
        :param connection_url: Connection url of DB Rest endpoint
        :return: new Api object
        """
        self.connection_url = connection_url

    def __send_cypher__(self, cypher):
        """
        :param cypher: Single string or list of cypher commands to send to Neo
        :return: data from server otherwise throw
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
            data["statements"] = {"statement": cypher}

        resp = r.post(self.connection_url, headers=headers, data=json.dumps(data))
        if resp.status_code is 200:
            return resp.json()
        else:
            resp.raise_for_status()

    def __is_sequence__(self, thing):
        return (not hasattr(arg, "strip") and
                hasattr(arg, "__getitem__") or
                hasattr(arg, "__iter__"))
