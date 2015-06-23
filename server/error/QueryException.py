__author__ = "Alistair McLean"

class QueryException(Exception):
    """Defines an exception in the Graph DB Query Layer"""
    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr(self.value)
