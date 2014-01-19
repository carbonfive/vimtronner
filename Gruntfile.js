module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mochaTest: {
      test: {
        options: {
          mocha: require('mocha')
        },
        src: ['test/**/*.coffee']
      }
    },
    coffee: {
      compile: {
        expand: true,
        cwd: 'src/',
        src: ['**/*.coffee'],
        dest: 'lib/',
        ext: '.js'
      }
    },
    watch: {
      tests: {
        files: ['test/**/*_test.coffee'],
        tasks: ['mochaTest']
      },
      src: {
        files: ['src/**/*.coffee'],
        tasks: ['mochaTest', 'coffee']
      }
    }
  });
  grunt.registerTask('build', ['mochaTest','coffee']);
  grunt.registerTask('default', ['mochaTest']);
};
