__author__ = 'Ivan'

from server.services.GraphTransformer import GraphTransformer
from server.error import GraphTransformerException
from nose.tools import raises
from sure import expect
import json
import os


@raises(GraphTransformerException)
def test_no_server_data():
    """Tests that the GraphTransformer throws and exception when no data is passed"""
    GraphTransformer.to_client_graph(None)


def test_single_triplet():
    """Tests that the GraphTransformer can parse a single triplet """
    dir = os.path.dirname(__file__)
    with open(os.path.join(dir, 'json' + os.sep + 'gt_valid_single.json')) as data_file:
        data = json.load(data_file)
        actual = GraphTransformer.to_client_graph(data)
        with open(os.path.join(dir, 'json' + os.sep + 'gt_valid_single_trans.json')) as data_file:
            expected = json.load(data_file)
            expect(actual).to.equal(expected)

def test_multiple_triplet():
    """Tests that the GraphTransformer can parse a single triplet """
    dir = os.path.dirname(__file__)
    with open(os.path.join(dir, 'json' + os.sep + 'gt_valid_multiple.json')) as data_file:
        data = json.load(data_file)
        actual = GraphTransformer.to_client_graph(data)
        expect(actual['links'].__len__()).to.equal(3)
        expect(actual['nodes'].__len__()).to.equal(5)
        # TODO Do we really need to validate content here?
        with open(os.path.join(dir, 'json' + os.sep + 'gt_valid_multiple_trans.json')) as data_file:
            expected = json.load(data_file)
            expect(actual).to.equal(expected)

def test_index_of_node():
    """Tests that the GraphTransformer can parse a single triplet """
    nodes = [{'url': 'al'}, {'url': 'tony'}, {'url': 'ivan'}, {'url': 'dan'}]
    key = "ivan"
    index = GraphTransformer.index_of_node(nodes, key)
    expect(index).to.equal(2)
