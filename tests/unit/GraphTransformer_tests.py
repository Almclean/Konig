__author__ = 'Ivan'

from server.services.GraphTransformer import GraphTransformer
from server.error import GraphTransformerException
from nose.tools import raises

@raises(GraphTransformerException)
def test_no_server_data():
    """Tests that the GraphTransformer throws and exception when no data is passed"""
    GraphTransformer.to_client_graph(None)