__author__ = "Alistair McLean"


class Resource(object):
    """Models a generic Resource"""

    def __init__(self, prop_map):
        self.name = prop_map['resource_name']
        self.type = prop_map['resource_type']
        self.location = prop_map['resource_location']
