module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  require('grunt-browserify')(grunt);
  require('grunt-contrib-uglify-es')(grunt);

  grunt.initConfig({
    config: grunt.file.readJSON('config.json'),
    babel: {
      options: {
        sourceMap: false,
        presets: ['@babel/preset-env']
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= config.mainStaticJs %>',
            src: ['**/*.js'],
            dest: '<%= config.mainOutStaticJs %>',
            ext: '.js'
          },
          {
            expand: true,
            cwd: '<%= config.subscribeStaticJs %>',
            src: ['**/*.js'],
            dest: '<%= config.subscribeOutStaticJs %>',
            ext: '.js'
          }
        ]
      }
    },
    browserify: {
      dist: {
        files: {
          '<%= config.mainBundle %>': ['<%= config.mainOutStaticJs %>/**/*.js'],
          '<%= config.subscribeBundle %>': ['<%= config.subscribeOutStaticJs %>/**/*.js']
        }
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          '<%= config.mainMinBundle %>': ['<%= config.mainBundle %>'],
          '<%= config.subscribeMinBundle %>': ['<%= config.subscribeBundle %>']
        }
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['babel', 'browserify', 'uglify']);

};