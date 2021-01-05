const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');
module.exports = {
  ...jestConfig,
  moduleNameMapper: {
    '^lightning/flowSupport$':
      '<rootDir>/src/test/jest-mocks/lightning/flowSupport'
  }
};
