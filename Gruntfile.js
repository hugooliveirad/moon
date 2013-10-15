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
                    'tests/lib/js/tests.js': ['src/Moon.coffee', 'tests/src/coffee/tests.coffee']
                }
            }
        },
        sass: {
            compile: {
                options: {
                   style: 'expanded'
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
		},
        coffeelint: {
            options: {
                arrow_spacing: {
                    level: 'error'
                },
                indentation: {
                    value: 4,
                    level: 'error'
                },
                max_line_length: {
                    level: 'ignore'
                },
                no_empty_param_list: {
                    level: 'error'
                }
            },
            app: ['demo/**/*.coffee', 'src/**/*.coffee', 'tests/**/*.coffee']
        },
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
    grunt.loadNpmTasks('grunt-coffeelint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('compile', ['coffee', 'sass']);
    grunt.registerTask('test', ['compile', 'qunit:all']);
    grunt.registerTask('prepare', ['test', 'uglify']);

    grunt.registerTask('travis', ['qunit', 'coffeelint']);

};
