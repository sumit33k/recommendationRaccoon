var _ = require('underscore');

module.exports = function(grunt) {
  'use strict';

  var files = {
    src: './*.js',
    tests: 'test/**/*.js'
  };

  // Project configuration.
  grunt.initConfig({
    meta: {
      pkg: grunt.file.readJSON('package.json')
    },

    jshint: {
      all: [
        'Gruntfile.js',
        files.src,
        files.tests
      ]
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'min',
          require: 'test/common'
        },
        src: [files.tests]
      }
    },
    mochacov: {
      test: {}, // Run with the spec testrunner
      coverage: {
        options: {
          coveralls: {
            serviceName: 'travis-ci'
          }
        }
      },
      options: {
        reporter: 'spec',
        ignoreLeaks: false,
        files: [files.tests]
      }
    },
    watch: {
      tests: {
        files: _.toArray(files),
        tasks: ['test']
      }
    }
  });

  // On watch events, configure jshint:all to run only on changed file
  grunt.event.on('watch', function(action, filepath) {
    grunt.config(['jshint', 'all'], filepath);
  });

  // Load third-party modules
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-mocha-cov');


  // Tasks
  grunt.registerTask('travis', [ 'jshint', 'mochacov:coverage' ]);
  grunt.registerTask('test', ['jshint:all', 'mochaTest']);

  // Default task (runs when running `grunt` without arguments)
  grunt.registerTask('default', ['test']);
};