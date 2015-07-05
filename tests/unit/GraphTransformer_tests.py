__author__ = 'Ivan'

from server.services import GraphTransformer
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
        # Test links
        expect(actual['links'].__len__()).to.equal(1)
        expect(actual['links'][0]['url']).to.equal('http://162.243.169.45:7474/db/data/relationship/160')
        # Test nodes
        expect(actual['nodes'].__len__()).to.equal(2)
        actual_node_url = []
        for node in actual['nodes']:
            actual_node_url.append(node['url'])
        expect(actual_node_url.__contains__('http://162.243.169.45:7474/db/data/node/282')).to.equal(True)
        expect(actual_node_url.__contains__('http://162.243.169.45:7474/db/data/node/158')).to.equal(True)


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
