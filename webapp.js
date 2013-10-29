
var api = require('./lib/api');
var parser = require('url');

module.exports = {

  listRepos: function (userConfig, done) {
    api.get(userConfig,"projects",function(err,data){
      done(null, data.map(api.parseRepo).filter(function(repo){
        return repo.config.scm === 'git';
      }))
    });
  },

  getFile: function (filename, ref, account, config, project, done) {
    var id = project.provider.repo_id;
    var branch = project.branches[0].name;
    // GET /projects/:id/repository/blobs/branch?filepath=filename
    var req = "projects/"+id+"/repository/blobs/"+branch+"?filepath="+filename;
    console.log(req);
    api.get(account.config,req, function(err,body){
      done(err, body);
    });
  },

}
