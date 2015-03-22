Package.describe({
  name: 'davish:accounts-dalton',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Meteor login service for the Dalton School',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/dbh937/accounts-dalton.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.4');
  api.addFiles('accounts-dalton.js');

  api.use('accounts-base');

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('davish:accounts-dalton');
  api.addFiles('accounts-dalton-tests.js');
});
