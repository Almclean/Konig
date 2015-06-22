__author__ = "Alistair McLean"

class Query(object):
    """Models a query object"""
    def __init__(self, prop_map):
        self.query_title = prop_map['query_title']
        self.query_version = prop_map['query_version']
        self.query_text = prop_map['query_text']
        self.triplets = prop_map['triplets']
        self.url = prop_map['url']
