module.exports = {
    options: {
        banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    },
    dist: {
    	files: {
    		'./app.min.js': ['./app.js']
    	}
    }
};