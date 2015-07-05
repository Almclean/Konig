__author__ = 'Ivan'

import json
import os

from nose.tools import raises
from sure import expect
import pydash

from server.services import GraphTransformer
from server.error import GraphTransformerException


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
        links = pydash.pluck(actual['links'], 'url')
        expect(len(links)).to.equal(1)
        expect(links).to.equal(['http://162.243.169.45:7474/db/data/relationship/160'])
        # Test nodes
        nodes = pydash.pluck(actual['nodes'], 'url')
        expect(len(nodes)).to.equal(2)
        expect('http://162.243.169.45:7474/db/data/node/282' in nodes).to.equal(True)
        expect('http://162.243.169.45:7474/db/data/node/158' in nodes).to.equal(True)


def test_multiple_triplet():
    """Tests that the GraphTransformer can parse a single triplet """
    dir = os.path.dirname(__file__)
    with open(os.path.join(dir, 'json' + os.sep + 'gt_valid_multiple.json')) as data_file:
        data = json.load(data_file)
        actual = GraphTransformer.to_client_graph(data)
        # Test links
        links = pydash.pluck(actual['links'], 'url')
        expect(len(links)).to.equal(3)
        expect('http://162.243.169.45:7474/db/data/relationship/160' in links).to.equal(True)
        expect('http://162.243.169.45:7474/db/data/relationship/161' in links).to.equal(True)
        expect('http://162.243.169.45:7474/db/data/relationship/164' in links).to.equal(True)
        # Test nodes
        nodes = pydash.pluck(actual['nodes'], 'url')
        expect(len(nodes)).to.equal(5)
        expect('http://162.243.169.45:7474/db/data/node/284' in nodes).to.equal(True)
        expect('http://162.243.169.45:7474/db/data/node/283' in nodes).to.equal(True)
        expect('http://162.243.169.45:7474/db/data/node/282' in nodes).to.equal(True)
        expect('http://162.243.169.45:7474/db/data/node/159' in nodes).to.equal(True)
        expect('http://162.243.169.45:7474/db/data/node/158' in nodes).to.equal(True)


def test_index_of_node():
    """Tests that the GraphTransformer can parse a single triplet """
    nodes = [{'url': 'al'}, {'url': 'tony'}, {'url': 'ivan'}, {'url': 'dan'}]
    key = "ivan"
    index = GraphTransformer.index_of_node(nodes, key)
    expect(index).to.equal(2)
