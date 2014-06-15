module.exports = {
    options: {
        reporter: require('jshint-stylish'),
        debug: true,
        node: true
    },
    target: ['./public/javascript/*.js', './routes/**/*.js', './controllers/**/*.js']
};