
var api = require('./lib/api');
var parser = require('url');

module.exports = {

  listRepos: function (userConfig, done) {
    api.get(userConfig,"projects",function(err,data){
      if(!err){
        repos = JSON.parse(data);
        done(null, repos.map(api.parseRepo).filter(function(repo){
          return repo.config.scm === 'git';
        }));
      } else {
        console.log(err);
      }

    });
  },

  getFile: function (filename, ref, account, config, project, done) {
    var id = project.provider.repo_id;
    var branch = project.branches[0].name;
    // GET /projects/:id/repository/blobs/branch?filepath=filename
    var req = "projects/"+id+"/repository/blobs/"+branch+"?filepath="+filename;
    console.log(req);
    api.get(account.config,req, function(err,data){
      var content = "";
      if(!err && data !== undefined){
        content = JSON.parse(data);
      }
      done(err, content);
    });
  },

}
