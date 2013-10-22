
var api = require('./lib/api')

var API = 'https://bitbucket.org/api/1.0/'

module.exports = {
  appConfig: {
    myHostname: 'http://localhost:3000',
    appKey: 'yxP57RbJNLsCjzvn3p',
    appSecret: 'n65ZnGRkE58AsVfPMKugaPSuWKGXMtTg'
  },

  accountConfig: {
    accessToken: String,
    tokenSecret: String,
    login: String,
    avatar: String,
    name: String
  },

  config: {
    url: String,
    owner: String,
    repo: String,
    scm: String,
    cache: Boolean,
    pull_requests: {type: String, enum: ['all', 'none', 'whitelist']},
    whitelist: [{
      name: String,
      level: {type: String, enum: ['tester', 'admin']}
    }],
    pk: Number,
    // type: https || ssh
    auth: {}
  },

  getBranches: function (account, config, project, done) {
    var client = this.oauth(account)
    client.get(API + 'repositories/' + project.name + '/branches', function (err, data, res) {
      done(null, Object.keys(data))
    })
  },

  getFile: function (filename, ref, account, config, project, done) {
    var client = this.oauth(account)
      , url = API + 'repositories/' + project.name + '/raw/' + ref + '/' + filename
    client.get(url, function (err, body, res) {
      done(err, body)
    })
  },

  fastFile: true,

  setupRepo: function (account, config, project, done) {
    var client = this.oauth(account)
      , url = API + 'repositories/' + project.name + '/deploy-keys'
      , key
    for (var i=0; i<project.branches.length; i++) {
      if (project.branches[i].name === 'master') {
        key = project.branches[i].pubkey.toString()
        break
      }
    }
    client.post(url, {
      label: 'strider at ' + this.appConfig.myHostname,
      key: key
    }, function (err, data, res) {
      if (err) return done(err)
      config.pk = data[0].pk
      done(null, config)
      /*
      client.post(API + 'repositories/' + project.name + '/services/', {
        type: 'POST',
        */
    })
  },

  teardownRepo: function (account, config, project, done) {
    var client = this.oauth(account)
      , url = API + 'repositories/' + project.name + '/deploy-keys/' + config.pk
    client.del(url, done)
  },

  globalRoutes: function (app, context) {
  },

  // register the passport auth strategy
  auth: function (passport, context) {
    var config = this.appConfig
  },
}

function validateAuth(req, token, tokenSecret, profile, done) {
  if (!req.user) {
    return done(new Error("Cannot sign up with bitbucket - you must link it to account"));
  } 
  var account = req.user.account('bitbucket', profile.username)
  if (account) {
    console.warn("Trying to attach a gitlab account that's already attached...")
    return done(new Error('Account already linked to this user'))
  }
  req.user.accounts.push(makeAccount(token, tokenSecret, profile))
  req.user.save(function (err) {
    done(err, req.user);
  })
}

function makeAccount(token, tokenSecret, profile) {
  var username = profile.username
    , cache = profile._json.repositories.map(api.parseRepo).filter(function (repo) {
        return repo.config.scm === 'git';
      })
  return {
    provider: 'gitlab',
    id: profile.username,
    display_url: 'https://bitbucket.com/' + profile.username,
    title: profile.username,
    config: {
      accessToken: token,
      tokenSecret: tokenSecret,
      login: profile.username,
      avatar: profile._json.user.avatar,
      name: profile.displayName
    },
    cache: cache
  }
}
