__author__ = 'Ivan'

import logging

from pydash.objects import deep_get

from server.error import GraphTransformerException

log = logging.getLogger(__name__)


class GraphTransformer(object):
    @staticmethod
    def to_client_graph(data):
        """
        Takes a given a server graph, in JSON format and transforms it into a client side graph, in JSON format.
        NOTE: The client side graph here is in a vaild D3 format of nodes and links, more details in
        public/javascripts/QueryEditor.js
        :param data: The server side, e.g. data container representation of the data
        :return: JSON data in the client format
        (http://docs.python-requests.org/en/latest/user/quickstart/#errors-and-exceptions)
        """
        if not data:
            log.error("No data to transform")
            raise GraphTransformerException("No data to transform")
        log.debug("About to parse " + str(data))
        nodes = {}
        triplets = deep_get(data, 'triplets')
        for trip in triplets:
            nodes[deep_get(trip, '0.source.url')] = deep_get(trip, '0.source')
            nodes[deep_get(trip, '2.target.url')] = deep_get(trip, '2.target')

        uniq_nodes = []
        for node in nodes.values():
            uniq_nodes.append({"name": node['data']['name'], "group": node['label'], "url": node['url']})

        links = []
        for trip in triplets:
            links.append({"source": GraphTransformer.index_of_node(uniq_nodes, deep_get(trip, '0.source.url')),
                          "target": GraphTransformer.index_of_node(uniq_nodes, deep_get(trip, '2.target.url')),
                          "value": 1,
                          "url": deep_get(trip, '1.relationship.url')})

        res = {"nodes": uniq_nodes, "links": links}
        log.debug("Returning " + str(res))
        return res

    @staticmethod
    def index_of_node(nodes, url):
        """
       Given a list of dictionaries and a url to find in a dictionary returns the index of the matching dictionary
       :param nodes: The list of nodes
       :param nodes: The node_key to find the index of
       :return: Int the index of the node_key in the list
       """
        for i, k in enumerate(nodes):
            if k['url'] == url:
                return i
