/**
 * Created by davis on 3/21/15.
 */
Accounts.registerLoginHandler(function(loginRequest) {
  if (!loginRequest.username)
    return undefined;

  var result = validateUser(loginRequest.username, loginRequest.password);
  if (result.success) {
    var userId = null;
    var user = Meteor.users.findOne({username: result.username});
    if (!user) {
      userId = Meteor.users.insert({username: result.username});
    } else {
      userId = user._id;
    }
    var stampedToken = Accounts._generateStampedLoginToken();
    var hashStampedToken = Accounts._hashStampedToken(stampedToken);
    Meteor.users.update(userId, {$push: {'services.resume.loginTokens': hashStampedToken}});
    return {id: userId, token: stampedToken.token};
  } else {
    return null;
  }
});

function validateUser(username, password) {
  username = username.split('@')[0]; // if someone uses their email, we only want the username.
  var r;
  try {
    r = HTTP.call("POST", "https://sandbox.dalton.org/webapps/auth/index.php/login", {
      data: {
        token: '422e92bbaeb54f14a6bf971abe8a0a57',
        username: username,
        password: password
      }
    });
  } catch(e) {
    r = {};
  }
  return r;

}