/**
 * Created by davis on 3/21/15.
 */

Meteor.loginWithDalton = function(username, password, callback) {
  var loginRequest = {username: username, password: password};
  Accounts.callLoginMethod({
    methodArguments: [loginRequest],
    userCallback: callback
  })
};