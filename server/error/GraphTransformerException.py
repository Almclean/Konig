__author__ = "Alistair McLean"


class GraphTransformerException(Exception):
    """Defines an exception in the Graph Transformation section"""

    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr(self.value)
