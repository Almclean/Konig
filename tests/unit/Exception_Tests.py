__author__ = "Alistair McLean"

from nose.tools import raises
from server.error import ApiException, GraphTransformerException, QueryException, UserException


@raises(ApiException)
def testApiException():
    raise ApiException("Failure in the API")


@raises(GraphTransformerException)
def testGraphTransformerException():
    raise GraphTransformerException("Failure in the Graph Transfomer Layer")


@raises(QueryException)
def testQueryException():
    raise QueryException("This is a query failure")


@raises(UserException)
def testUserException():
    raise UserException("This is some kind of User exception")
