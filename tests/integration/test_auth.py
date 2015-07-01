__author__ = 'almclean'

from server.services import Api, Userservice


def test_authentication():
    """Integration test for authentication"""

    a = Api('http://162.243.169.45:7474/db/data/transaction/commit')
    u = Userservice(a)
    assert u.authenticate('Al', 'blah')


if __name__ == '__main__':
    test_authentication()
