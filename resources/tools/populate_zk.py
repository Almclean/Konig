__author__ = 'almclean'

from kazoo.client import KazooClient


def load_env_vars(target_env, hosts=None):
    zk = KazooClient()
    zk.start()
    node_endpoint = '/konig/' + '/' + target_env

    zk.ensure_path(node_endpoint)
    zk.create(node_endpoint + '/neo4j_endpoint', b'http://localhost:7474/db/data/transaction/commit')
    print('Created endpoint for {env_var}'.format(env_var=target_env))
    zk.stop()


if __name__ == '__main__':
    load_env_vars('alistaim')
