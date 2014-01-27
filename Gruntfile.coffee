module.exports = (grunt) ->
    grunt.initConfig(
        coffee:
            options:
                bare: true
                join: true
            
            compile:
                files:
                    'lib/moon.js': 'src/Moon.coffee'
                    'tests/lib/js/tests.js': ['src/Moon.coffee', 'tests/src/coffee/tests.coffee']
                
        uglify:
            options:
                mangle: true
                report: 'gzip'
            
            my_target:
                files:
                    'lib/moon.min.js': ['lib/moon.js']
                
        qunit:
            all: ['tests/**/*.html']

        coffeelint:
            options:
                arrow_spacing:
                    level: 'error'
                
                indentation:
                    value: 4
                    level: 'error'
                
                max_line_length:
                    level: 'ignore'
                
                no_empty_param_list:
                    level: 'error'
                
            
            app: ['src/**/*.coffee', 'tests/**/*.coffee']
        
        watch:
            scripts:
                files: ['**/*.coffee']
                tasks: ['coffee']
            
            styles:
                files: ['**/*.scss']
                tasks: ['sass']
            
    )

    grunt.loadNpmTasks('grunt-contrib-coffee')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-qunit')
    grunt.loadNpmTasks('grunt-coffeelint')
    grunt.loadNpmTasks('grunt-contrib-watch')

    grunt.registerTask('compile', ['coffee'])
    grunt.registerTask('test', ['coffeelint', 'compile', 'qunit:all'])
    grunt.registerTask('build', ['test', 'uglify'])
    grunt.registerTask('default', ['watch:scripts'])

    grunt.registerTask('travis', ['test'])
