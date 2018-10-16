// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    files: [
      
      { pattern: './src/assets/**/*', watched: false, included: false, served: true, nocache: false },
      { pattern: './node_modules/Cesium/Build/Cesium/Cesium.js', watched: false }
    ],
    proxies: {
      '/assets/': '/base/src/assets/'
    },
    preprocessors: {
      
    },
    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },
    remapIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'), reports: {
        html: 'coverage',
        lcovonly: './coverage/coverage.lcov'
      }
    },
    
    reporters: config.angularCli && config.angularCli.codeCoverage
      ? ['progress', 'coverage-istanbul']
      : ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    browserNoActivityTimeout: 60000,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 1,
    captureTimeout: 60000
  });
};
