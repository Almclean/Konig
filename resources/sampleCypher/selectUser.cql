MATCH (user:Adminstration { name:"<INSERT_USER_NAME_HERE>" })-[:IS_IN]->(groups)-[:HAS_ACTION]->(actions)-[:ON]->(resources)
RETURN  user, groups, actions, resources