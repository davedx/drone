// for this to work, you will need a webserver running with your app and an environment variable
// set to the base URL for your webserver.
// e.g. SERVER_PATH = http://localhost:8080
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var path = require('path');
var binPath = phantomjs.path;

var appPath = 'myApp/';

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
  });

  grunt.registerTask('phantomtest', 'Run Phantom tests', function() {
    var done = this.async();
    // pass the webserver URL from the SERVER_PATH environment variable to the phantom
    // test script
    var childArgs = [
      path.join(appPath + 'phantom-tests.js'),
      process.env.SERVER_PATH
    ];
    var p = childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
      grunt.log.write(stdout);
    });
    // add a listener to the child process: if the tests exists with a non-zero value,
    // the tests failed, so pass this result back to grunt in its done() callback
    p.addListener("exit", function (code) {
      done(code === 0);
    });
  });

  grunt.registerTask('default', ['phantomtest']);
};