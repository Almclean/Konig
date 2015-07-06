__author__ = 'almclean'

import logging

from kazoo.client import KazooClient

log = logging.getLogger(__name__)


class ZKConfig(object):
    def __init__(self, env, zoo_keeper_hosts=None):
        """
        :param env: one of {dev, qa, uat, prod, <user_name}
        :param use_zookeeper: True/False - defaults to True
        :param zoo_keeper_hosts: Python list of zookeeper hosts instead of localhost
        :return: new ZKConfig object
        """
        self.env = env
        self.BASE_DIR = '/konig'
        self.ENV = '/' + str(self.env) + '/'
        if not zoo_keeper_hosts:
            self.zk = KazooClient()
            self.zk.start()
            log.info('ZKConfig is ZooKeeper local conf')
        else:
            self.zk = KazooClient(hosts=zoo_keeper_hosts)
            self.zk.start()
            log.info('ZKConfig is ZooKeeper multi conf @ {zk}'.format(zk=zoo_keeper_hosts))

    def get_rest_endpoint(self):
        return self.zk.get(self.BASE_DIR + self.ENV + '/neo4j_endpoint')[0]

    def stop_zookeeper_connection(self):
        self.zk.stop()
