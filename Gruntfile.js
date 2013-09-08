'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        coffee: {
            options: {
                bare: true,
                join: true
            },
            compile: {
                files: {
                    'lib/moon.js': 'src/Moon.coffee',
                    'demo/lib/js/app.js': ['src/Moon.coffee', 'demo/src/coffee/app.coffee'],
					'tests/lib/tests.js': ['src/Moon.coffee', 'tests/src/tests.coffee']
                }
            }
        },
         sass: {
            compile: {
                options: {
                   style: 'expanded',
                   sourcemap: true,
                   compass: true
                },
                files: {
                    'demo/lib/css/main.css': 'demo/src/scss/main.scss',
                }
            }
        },
        uglify: {
            options: {
                mangle: true
            },
            my_target: {
                files: {
                    'lib/moon.min.js': ['lib/moon.js']
                }
            }
		},
		qunit: {
			all: ['tests/**/*.html']
		}
        watch: {
            scripts: {
                files: ['**/*.coffee'],
                tasks: ['coffee']
            },
            styles: {
                files: ['**/*.scss'],
                tasks: ['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('compile', ['coffee', 'sass']);
    grunt.registerTask('test', ['compile', 'qunit:all']);
    grunt.registerTask('prepare', ['test', 'uglify'])

};
