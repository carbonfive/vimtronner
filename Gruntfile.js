module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mochaTest: {
      test: {
        options: {
          mocha: require('mocha'),
          require: 'test/common'
        },
        src: ['test/**/*_test.coffee']
      }
    },
    coffee: {
      compile: {
        options: {
          sourceMap: true,
          sourceMapDir: 'maps/'
        },
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
        tasks: ['build']
      },
      src: {
        files: ['src/**/*.coffee'],
        tasks: ['build']
      }
    }
  });
  grunt.registerTask('build', ['coffee', 'mochaTest']);
  grunt.registerTask('default', ['mochaTest']);
};
