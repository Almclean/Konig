__author__ = 'Ivan O\'Mahony'

import sys
import json
import logging
from random import randint, shuffle
from optparse import OptionParser

##
# Load JSON data from the file provided. This will return a {} if there is an issue loading data
#
##
def loadJSON(json_file):
    logging.info("About to parse JSON file")
    json_data = {}
    try:
        with open(json_file) as f:
            json_data = json.load(f)
            logging.info("JSON Data - {0}".format(json_data))
    except IOError as e:
        logging.error("I/O error({0}) - {1}".format(e.errno, e.strerror))
    except ValueError as ve:
        logging.error("Could not parse JSON. Error was - {0}".format(ve))
    except:
        logging.error("Unexpected error:", sys.exc_info()[0])
    logging.info("JSON parsed")
    return json_data


##
# Create the set of Accounts Names to use when creating a sample set of data.
# This is based on the num_accs passed into the script and will be shuffled
#
##
def generateAccNames(num_accs):
    logging.info("About to create Accounts")
    acc_ids = []
    for n in range(0, (int(num_accs) + 1)):
        acc_ids.append('A{}'.format(n))
    shuffle(acc_ids)
    logging.info("Accounts created and shuffled")
    return acc_ids


##
# Given the set of JSON data and also the generated Accounts go a randomly piece it all together
# This will dump a file called data_load.cql to you working dir which we can then use to load into the db
#
##
def generateDataLoad(json_data, accounts):
    logging.info("About to start writing cql file")
    # Set up all the Ratings, Locations and Accounts
    with open('data_load.cql', 'a') as cql:
        # Create all the Ratings
        for rating in json_data["ratings"]:
            cql.write("CREATE ({0}:Rating {{name:'{1}'}} )\n".format(rating["id"], rating["name"]))
        # Create all the Locations
        for location in json_data["locations"]:
            cql.write("CREATE ({0}:Location {{name:'{1}'}} )\n".format(location["id"], location["name"]))
        # Create all the Accounts
        for account in accounts:
            cql.write("CREATE ({0}:Account {{name:'{0}'}})\n".format(account))
    # Create partitions for the set of accounts
    randomAccounts = partition(accounts, len(json_data["parties"]))
    count = 0
    # Create Parties and related data
    for party in json_data["parties"]:
        logging.info("Party is - {}".format(party))
        # Each party will have 1 rating
        rating = json_data["ratings"][randint(0, 4)]
        logging.info("Rating will be - {}".format(rating))
        with open('data_load.cql', 'a') as cql:
            # Create the Party
            cql.write("CREATE ({0}:Party {{name:'{1}'}} )\n".format(party["id"], party["name"]))
            # Relate the Party to the previously selected random Rating
            cql.write("CREATE ({0})-[:HAS_RATING]->({1})\n".format(party["id"], rating["id"]))
            # Relate the Party to a random number of Locations
            for n in range(1, randint(1, 3)):
                cql.write("CREATE ({0})-[:LOCATED_IN]->({1})\n".format(party["id"], json_data["locations"][n]["id"]))
                logging.info("Location will be - {}".format(json_data["locations"][n]["name"]))
            for n in randomAccounts[count]:
                cql.write("CREATE ({0})-[:OWNS]->({1})\n".format(party["id"], n))
                logging.info("Account will be - {}".format(n))
        count += 1
    logging.info("cql file written")

##
# Random function to partition and iterable into n sized chunks
#
##
def partition(lst, n):
    division = len(lst) / float(n)
    return [lst[int(round(division * i)): int(round(division * (i + 1)))] for i in range(n)]


##
# Given a random number, say 10,000 create
# that many accounts with the format A1, A2, A2...A N
# link those, at random, to a given Party (generate from a list in a json file
# for each Party associate it to a random number of Locations
# for each Party associate it to Credit Rating again at random but only 1

# CREATE (A1:Account {name:'A1'})
# CREATE (A2:Account {name:'A2'})
# CREATE (P1:Party {name:'JPM'})
# CREATE
#       (A1)-[:OWNED_BY]->(P1),
#       (A2)-[:OWNED_BY]->(P1)
# CREATE (G1:Location {name:'US'})
# CREATE (G2:Location {name:'UK'})
# CREATE
#       (P1)-[:LOCATED_IN]->(G1),
#       (P1)-[:LOCATED_IN]->(G2)
# CREATE (R1:Rating {name:'AA'})
# CREATE (P1)-[:HAS_RATING]->(R1)\
#
##
def main():
    logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
    logging.info("About to start generating data")
    parser = OptionParser()
    parser.add_option('-n', dest="num_accs", default=100, help="Number of Accounts to Create")
    parser.add_option('-f', dest="json_file", help="JSON File for init data")
    (options, args) = parser.parse_args()
    if options.num_accs:
        logging.info("Number of Accounts to create - {0}".format(options.num_accs))
    else:
        logging.info("Defaulting number of Accounts to 100")
    if options.json_file:
        logging.info("JSON data file to use in generation - {0}".format(options.json_file))
    else:
        logging.info("Missing JSON File Terminating")
        sys.exit(2)
    json_data = loadJSON(options.json_file)
    accounts = generateAccNames(options.num_accs)
    generateDataLoad(json_data, accounts)
    logging.info("Data Generated")


if __name__ == '__main__':
    main()