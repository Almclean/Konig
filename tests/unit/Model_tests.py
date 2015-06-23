__author__ = "Alistair Mclean"

__doc__ = """Simple domain class tests"""


from models import Action, Group, Query, Resource, User

def testActionObj():
    a = Action("myNewAction")
    assert a.name == "myNewAction"

def testGroupObj():
    g = Group("myNewGroup")
    assert g.name == "myNewGroup"

def testQueryObj():
    props = {
        'query_text': 'blah',
        'query_title': 'a title',
        'query_version': 1,
        'url': 'http://blah.com',
        'triplets': {'triplet1': 'somevalue', 'triplet2': 'another value'}
    }
    q = Query(props)
    assert q.query_title == 'a title'
    assert q.query_text == 'blah'
    assert q.query_version == 1
    assert q.url == 'http://blah.com'
    assert q.triplets == {'triplet1': 'somevalue', 'triplet2': 'another value'}

def testUser():
    u = User('Alistaim', 'apassword')
    assert u.user_name == 'Alistaim'
    assert u.password == 'apassword'

def testResource():
    p = {
        'resource_name': 'A New Resource',
        'resource_type': 'a type',
        'resource_location': 'a location'
    }
    r = Resource(p)
    assert r.name == 'A New Resource'
    assert r.type == 'a type'
    assert r.location == 'a location'
