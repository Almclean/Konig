__author__ = "Alistair McLean"

class UserException(Exception):
    """Defines an exception in the User Service layer"""
    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr(self.value)
