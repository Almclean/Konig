CREATE (A1:Account {name:'A1'})
CREATE (A2:Account {name:'A2'})

CREATE (P1:Party {name:'JPM'})
CREATE
      (A1)-[:OWNED_BY]->(P1),
      (A2)-[:OWNED_BY]->(P1)

CREATE (G1:GeoLoc {name:'US'})
CREATE (G2:GeoLoc {name:'UK'})
CREATE
      (P1)-[:LOCATED_IN]->(G1),
      (P1)-[:LOCATED_IN]->(G2)

CREATE (R1:Rating {name:'AA'})
CREATE
    (P1)-[:HAS_RATING]->(R1)