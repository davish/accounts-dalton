/**
 * Created by davis on 3/21/15.
 */
Accounts.registerLoginHandler(function(loginRequest) {
  if (!loginRequest.username || !loginRequest.password)
    return undefined;
  return createFromDalton(loginRequest.username, loginRequest.password);
});

function createFromDalton(username, password) {
  var result = validateUser(username, password);
  if (!result.error) {
    var userId = null;
    var user = Meteor.users.findOne({username: result.username.toLowerCase()});
    if (!user) {
      userId = Accounts.createUser({
        username: result.username.toLowerCase(),
        profile: {
          email: result.email.toLowerCase(),
          fullname: result.fullname,
          grade: parseInt(result.description)
        }
      });
      if (result.groups.indexOf('Students') >= 0) {
        Roles.addUsersToRoles(userId, 'student');
      } else {
        Roles.addUsersToRoles(userId, 'faculty');
      }
      if (_.contains(["c17dh", "c15mb", "cforster"], result.username.toLowerCase())) {
        Roles.addUsersToRoles(userId, 'admin');
      }
    } else {
      userId = user._id;
    }
    var stampedToken = Accounts._generateStampedLoginToken();
    var hashStampedToken = Accounts._hashStampedToken(stampedToken);
    Meteor.users.update(userId, {$push: {'services.resume.loginTokens': hashStampedToken}});
    return {userId: userId, token: stampedToken.token};
  } else {
    return {error: new Meteor.Error(403, 'Incorrect password')};
  }
}

Accounts.createFromDalton = createFromDalton;

Accounts.createUser = function(options) {
  try {
    check(options, Match.ObjectIncluding({
      username: String,
      profile: Match.ObjectIncluding({
        email: String,
        fullname: String,
        grade: Number
      })
    }));
  } catch (ex) {
    return {error: new Meteor.Error(403, 'Invalid login')};
  }

  return Accounts.insertUserDoc(options, {
    username: options.username,
    profile: {
      email: options.profile.email,
      fullname: options.profile.fullname,
      grade: options.profile.grade
    }
  });
};

function validateUser(username, password) {
  username = username.split('@')[0]; // if someone uses their email, we only want the username.
  var r;
  try {
    var token = HTTP.post("https://sandbox.dalton.org/webapps/auth/index.php/token", {
      params: {username:'temp', password:'temp'}
    }).data.token;
    r = HTTP.call("POST", "https://sandbox.dalton.org/webapps/auth/index.php/login", {
      params: {
        token: token,
        username: username,
        password: password
      }
    }).data;
  } catch(e) {
    r = {};
  }
  return r;
};