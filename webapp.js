
var api = require('./lib/api');
var parser = require('url');

module.exports = {

  listRepos: function (userConfig, next) {
    api.get(userConfig,"projects",function(data){
      var repos = new Array();
      var parsed = parser.parse(userConfig.api_url);
      data.forEach(function(repo){
        repo.org = parsed.hostname;
        repo.display_url = parsed.protocol+'//'+parsed.hostname+'/'+repo.name;
        repos.push(repo);
      })
      next(null, repos.map(api.parseRepo).filter(function(repo){
        return repo.config.scm === 'git';
      }))
    });
  },

}
