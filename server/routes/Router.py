__author__ = 'almclean'

from flask import Blueprint

Router = Blueprint('Router', __name__)


@Router.route('/')
def say_hello():
    return 'Hello, World !'
