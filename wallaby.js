module.exports = function() {
  return {
    files: ['lib/**/*.js', 'spec/**/*.txt'],

    tests: ['spec/*.spec.js'],

    env: {
      type: 'node'
    },

    testFramework: 'mocha'
  };
};
