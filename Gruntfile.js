module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-coffee');
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
      glob_to_multiple: {
        expand: true,
        cwd: 'src/',
        src: ['**/*.coffee'],
        dest: 'lib/',
        ext: '.js'
      }
    }
  });
  grunt.registerTask('default', ['mochaTest']);
};
