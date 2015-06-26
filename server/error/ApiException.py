__author__ = "Alistair McLean"


class ApiException(Exception):
    """Defines an exception in the API Service Layer"""

    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr(self.value)
