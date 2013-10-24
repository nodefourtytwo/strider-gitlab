
var api = require('./lib/api');

module.exports = {

  listRepos: function (userConfig, next) {
    api.get(userConfig,"projects",function(data){
      console.log(typeof data);
      next(null, data.map(api.parseRepo).filter(function(repo){
        return repo.config.scm === 'git';
      }))
    });
  },

}
