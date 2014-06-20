CREATE (U1:ReadOnlyUser:Adminstration {name:'Read Only', password:''} )
CREATE (U2:AdminUser:Adminstration {name:'Admin', password:''} )
CREATE (U3:QueryBuilderUser:Adminstration {name:'Query Builder', password:''} )

CREATE (G1:ReadOnlyGroup:Adminstration {name:'Read Only Group'} )
CREATE (G2:AdminGroup:Adminstration {name:'Admin Group'} )
CREATE (G3:QueryBuilderGroup:Adminstration {name:'Query Builder Group'} )

CREATE (U1)-[:IS_IN]->(G1)
CREATE (U2)-[:IS_IN]->(G2)
CREATE (U3)-[:IS_IN]->(G3)

CREATE (A1:Action:Adminstration {name:'Create'} )
CREATE (A2:Action:Adminstration {name:'Read'} )
CREATE (A3:Action:Adminstration {name:'Update'} )
CREATE (A4:Action:Adminstration {name:'Delete'} )
CREATE (A5:Action:Adminstration {name:'Admin'} )

CREATE (R1:Resource:Adminstration {name:'#QueryBuilder', type: 'Screen', location:'login page'} )

CREATE (G1)-[:HAS_ACTION]->(A2)-[:ON]->(R1)

CREATE (G2)-[:HAS_ACTION]->(A1)-[:ON]->(R1)
CREATE (G2)-[:HAS_ACTION]->(A2)-[:ON]->(R1)
CREATE (G2)-[:HAS_ACTION]->(A3)-[:ON]->(R1)
CREATE (G2)-[:HAS_ACTION]->(A4)-[:ON]->(R1)
CREATE (G2)-[:HAS_ACTION]->(A5)-[:ON]->(R1)

CREATE (G3)-[:HAS_ACTION]->(A1)-[:ON]->(R1)
CREATE (G3)-[:HAS_ACTION]->(A2)-[:ON]->(R1)
CREATE (G3)-[:HAS_ACTION]->(A3)-[:ON]->(R1)
CREATE (G3)-[:HAS_ACTION]->(A4)-[:ON]->(R1)