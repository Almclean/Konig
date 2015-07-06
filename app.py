#! /usr/bin/env python

import logging

from flask import Flask

from server.config import ZKConfig
from server.routes import Router

log = logging.getLogger(__name__)
app = Flask(__name__)

# Register Blueprints
app.register_blueprint(Router)

# Get Config
config = ZKConfig('alistaim')
log.info(config.get_rest_endpoint())

if __name__ == '__main__':
    app.run()
