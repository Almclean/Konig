__author__ = 'Ivan'

from nose.tools import raises
from server.services import GraphTransformer
from server.error import GraphTransformerException
from sure import expect
import json
import pydash
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
        links = pydash.pluck(actual['links'], 'url')
        expect(links.__len__()).to.equal(1)
        expect(links).to.equal(['http://162.243.169.45:7474/db/data/relationship/160'])
        # Test nodes
        nodes = pydash.pluck(actual['nodes'], 'url')
        expect(nodes.__len__()).to.equal(2)
        expect(nodes.__contains__('http://162.243.169.45:7474/db/data/node/282')).to.equal(True)
        expect(nodes.__contains__('http://162.243.169.45:7474/db/data/node/158')).to.equal(True)


def test_multiple_triplet():
    """Tests that the GraphTransformer can parse a single triplet """
    dir = os.path.dirname(__file__)
    with open(os.path.join(dir, 'json' + os.sep + 'gt_valid_multiple.json')) as data_file:
        data = json.load(data_file)
        actual = GraphTransformer.to_client_graph(data)
        # Test links
        links = pydash.pluck(actual['links'], 'url')
        expect(links.__len__()).to.equal(3)
        expect(links.__contains__('http://162.243.169.45:7474/db/data/relationship/160')).to.equal(True)
        expect(links.__contains__('http://162.243.169.45:7474/db/data/relationship/161')).to.equal(True)
        expect(links.__contains__('http://162.243.169.45:7474/db/data/relationship/164')).to.equal(True)
        # Test nodes
        nodes = pydash.pluck(actual['nodes'], 'url')
        expect(nodes.__len__()).to.equal(5)
        expect(nodes.__contains__('http://162.243.169.45:7474/db/data/node/284')).to.equal(True)
        expect(nodes.__contains__('http://162.243.169.45:7474/db/data/node/283')).to.equal(True)
        expect(nodes.__contains__('http://162.243.169.45:7474/db/data/node/282')).to.equal(True)
        expect(nodes.__contains__('http://162.243.169.45:7474/db/data/node/159')).to.equal(True)
        expect(nodes.__contains__('http://162.243.169.45:7474/db/data/node/158')).to.equal(True)


def test_index_of_node():
    """Tests that the GraphTransformer can parse a single triplet """
    nodes = [{'url': 'al'}, {'url': 'tony'}, {'url': 'ivan'}, {'url': 'dan'}]
    key = "ivan"
    index = GraphTransformer.index_of_node(nodes, key)
    expect(index).to.equal(2)
