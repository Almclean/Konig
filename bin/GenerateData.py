__author__ = 'Ivan OMahony'

import sys

# Given a random number, say 10,000 create
# that many accounts with the format A1, A2, A2...A N
# link those, at random, to a given Party (generate from a list in a json file
# for each Party associate it to a random number of GeoLoc
# for each Party associate it to Credit Rating again at random but only 1

# CREATE (A1:Account {name:'A1'})
# CREATE (A2:Account {name:'A2'})
# CREATE (P1:Party {name:'JPM'})
# CREATE
#       (A1)-[:OWNED_BY]->(P1),
#       (A2)-[:OWNED_BY]->(P1)
# CREATE (G1:GeoLoc {name:'US'})
# CREATE (G2:GeoLoc {name:'UK'})
# CREATE
#       (P1)-[:LOCATED_IN]->(G1),
#       (P1)-[:LOCATED_IN]->(G2)
# CREATE (R1:Rating {name:'AA'})
# CREATE (P1)-[:HAS_RATING]->(R1)

###
#
# Just print the count for now
#
###
def printCount(accounts):
    print(accounts)

###
#
# Create a set of data to load into Neo4j
# This will output a Cypher file
#
###
def main():
    account_to_create = sys.argv[1]
    printCount(account_to_create)

if __name__ == '__main__':
    main()