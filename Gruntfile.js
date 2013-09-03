'use strict';

module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        coffee: {
            options: {
                bare: true,
                join: true
            },
            compile: {
                files: {
                    'lib/moon.js': 'src/Moon.coffee',
                    'demo/lib/app.js': ['src/Moon.coffee', 'demo/src/app.coffee'],
					'tests/lib/tests.js': ['src/Moon.coffee', 'tests/src/tests.coffee']
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'lib/moon.min.js': ['lib/Moon.js']
                }
            }
		},
		qunit: {
			all: ['tests/**/*.html']
		}
    });

    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');

    grunt.registerTask('compile', ['coffee', 'uglify']);
};
