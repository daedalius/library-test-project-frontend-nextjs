/// <reference types="cypress" />

const seedDatabase = require('./helpers/seedDatabase');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on('task', {
    'db:seed'() {
      return seedDatabase();
    }
  });
  return config;
};
