__author__ = 'almclean'

from server.services import Api
import json
from sure import expect
import httpretty


@httpretty.activate
def test_api_response():
    a = Api(connection_url="http://auld.nonsense.com")
    test_json_object = '{"title": "Test Resp"}'

    httpretty.register_uri(httpretty.POST, "http://auld.nonsense.com",
                           body=test_json_object,
                           content_type="application/json",
                           status=200)

    resp = a.__send_cypher__("Some auld bollocks")
    expect(resp).to.equal(json.loads(test_json_object))
