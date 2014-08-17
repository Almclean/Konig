CREATE (Q1:Query {title: "Party by Location", version: 1, queryText: "MATCH (pty:Party)-[IS_IN]->(loc:Location) RETURN pty, loc"})
CREATE (T1:Triplet {source: "Party", relationship: "IS_IN", target: "Location", sourceConstraint: "blah", relConstraint: "blah", targetConstraint: "blah"})
CREATE (T2:Triplet {source: "Account", relationship: "HAS_RATING", target: "Rating", sourceConstraint: "blah", relConstraint: "blah", targetConstraint: "blah"})

CREATE (Q1)-[:COMPRISED_OF]->(T1)
CREATE (Q1)-[:COMPRISED_OF]->(T2)