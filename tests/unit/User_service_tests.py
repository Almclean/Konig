__author__ = 'almclean'

from sure import expect
import httpretty

from server.services import Api, Userservice


@httpretty.activate
def test_user_authentication():
    """Tests that user auth works correctly"""
    a = Api("http://nonsense.com")
    u = Userservice(api=a)
    test_json_response = '{"results":[{"columns":["user"],"data":[{"row":[{"name":"Al","admin":"true","password":"$2a$10$cenYYSFNusCP3r437LPMhOVjygZAKez8jHfhXbXzUAprpgBwiJiYO"}]}]}],"errors":[]}'

    httpretty.register_uri(httpretty.POST, "http://nonsense.com",
                           body=test_json_response,
                           content_type="application/json",
                           status=200)
    resp = u.authenticate('Al', 'blah')
    expect(resp).to.equal(True)
