module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        filename: 'svg-interactive',
        dist: 'dist',
        meta: {
          modules: 'angular.module("svg-interactive", ' +
              '["svg-interactive.zoomable", "svg-interactive.pannable", "svg-interactive.utilities"]);',
          banner: ['/*',
                   ' * <%= pkg.name %>',
                   ' * Version: <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
                   ' * License: <%= pkg.license %>',
                   ' */\n'].join('\n')
        },
        concat: {
          dist: {
              options: {
                  banner: '<%= meta.banner %><%= meta.modules %>\n'
              },
              src: ['src/**/*.js'],
              dest: '<%= dist %>/<%= filename %>-<%= pkg.version %>.js'
          }
        },
        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['<%= concat.dist.dest %>'],
                dest: '<%= dist %>/<%= filename %>-<%= pkg.version %>.min.js'
            }
        },
        changelog: {
            options: {
                dest: 'CHANGELOG.md',
                templateFile: 'misc/changelog.tpl.md',
                github: 'svg-interactive'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-changelog');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify']);

};