__author__ = 'almclean'

from pydash.objects import deep_get
import bcrypt

from server.services import Api
from models import User
from server.error import UserException


class Userservice(object):
    def __init__(self, api=None):
        if not api:
            self.api = Api()
        else:
            self.api = api

    def get_by_user_name(self, user_name):
        """Returns new User object with stored hash, otherwise None"""
        queryText = "\n".join([
            "MATCH (user:AdminUser { name: {user_name} })",
            "RETURN user"
        ])

        user_result = self.api.query(queryText, parameters={"user_name": user_name})

        if not user_result['errors']:
            user_name = deep_get(user_result, 'results.0.data.0.row.0.name')
            password = deep_get(user_result, 'results.0.data.0.row.0.password')

            if user_name and password:
                return User(user_name, password)
            else:
                return None
        else:
            raise UserException(user_result['errors'])

    def authenticate(self, user_name, password):
        u = self.get_by_user_name(user_name)
        hashed = bcrypt.hashpw(str(password).encode('utf-8'), str(u.password).encode('utf-8'))
        if hashed == str(u.password).encode(
                'utf-8'):
            return True
        else:
            return False
