__author__ = 'Ivan'

import logging
from server.error import GraphTransformerException

log = logging.getLogger(__name__)

class GraphTransformer(object):

    @staticmethod
    def to_client_graph(data):
        """
        Takes a given a server graph, in JSON format and transforms it into a client side graph, in JSON format
        :param data: The server side, e.g. data container representation of the data
        :return: JSON data in the client format
        (http://docs.python-requests.org/en/latest/user/quickstart/#errors-and-exceptions)
        """
        if not data:
            log.error("No data to transform")
            raise GraphTransformerException("No data to transform")

        return data
