__author__ = "Alistair McLean"

class Resource(object):
    """Models a generic Resource"""
    def __init__(self, **prop_map):
        self.resource_name = prop_map['resource_name']
        self.resource_type = prop_map['resource_type']
        self.resource_location = prop_map['resource_location']
