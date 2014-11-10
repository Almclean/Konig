/**
 * Created by Ivan O'Mahony on 11/9/2014.
 */

// Tool generating slated hashes and validating a hash
var Promise = require("bluebird");
var r = Promise.promisifyAll(require("request"));
var bcrypt = require("bcrypt");
var api = new (require("../../server/services/Api"))();
var _ = require("lodash");
var util = require("util");

function main() {
    "use strict";
    if (process.argv.length <= 2) {
        console.log("\nThis is a simple util to generate a bcrypt hash for a string \n\n" +
        "To generate a hash please supply the below parameters:\n" +
        "\thash=ValueToHash\n\n");
    } else {
        var cmd = _.chain(process.argv)
            .rest(2)
            .invoke(String.prototype.split, "=")
            .flatten()
            .value();
        console.log(util.format("Received command [%s] with parameter %s", cmd[0], cmd[1]));
        if (cmd[0] === "hash") {
            bcrypt.hash(cmd[1], 10, function (err, hash) {
                console.log(util.format("Hash is [%s]", hash));
            });
        } else {
            console.log(util.format("Unknown command [%s] with parameter %s", cmd[0], cmd[1]));
        }
    }
}

main();


