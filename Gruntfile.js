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
                    'lib/Moon.js': 'src/Moon.coffee',
                    'demo/lib/app.js': ['src/Moon.coffee', 'demo/src/app.coffee']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-coffee');
};