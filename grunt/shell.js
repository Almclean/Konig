module.exports = {
    start_neo4j: {
        options: {
            stderr: true,
            stdout: true
        },
        command: [
            'echo Going to start Neo4J',
            '<%= neo4j_start %>'
        ].join('&&')
    }
};