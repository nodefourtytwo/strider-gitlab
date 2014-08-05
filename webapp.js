
var api = require('./lib/api');
var parser = require('url');

module.exports = {

  listRepos: function (userConfig, done) {
    api.get_r(userConfig,"projects",function(err,data){
      if(!err){
        var repos = JSON.parse(data);
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
    api.get(account.config,req, function(err,data){
      var content = "";
      if(!err && data !== undefined){
        content = JSON.parse(data);
      }
      done(err, content);
    });
  },

  getBranches: function(account, config, project, done) {
    var id = project.provider.repo_id;
    var req = "projects/"+id+"/repository/branches";
    api.get(account, req, function(err, data){
      var content = "";
      if(!err && data !== undefined){
        content = JSON.parse(data);
        var branches = [];
        content.forEach(function(branch){
          branches.push(branch.name);
        });
      }
      done(err, branches);
    });
  },

}
