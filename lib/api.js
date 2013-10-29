var request = require('superagent')

module.exports = {
  get: get,
  parseRepo: parseRepo
}

function get(config,content,callback) {

  if (content.indexOf("?") == -1){
    var link = "?";
  } else {
    var link = "&";
  }

  var url = config.api_url + '/' + content + link + 'private_token=' + config.api_key + '&per_page=100';

  console.log(url);
  request.get(url, function(err, res){
      callback(err,JSON.parse(res.text));
    });
}

function parseRepo(repo) {
  console.log(repo);
  return {
    id: repo.id,
    name: repo.path_with_namespace,
    display_name: repo.path_with_namespace,
    display_url: repo.web_url,
    group: repo.owner,
    private: !repo.public,
    config: {
      auth: { type: 'ssh' },
      scm: 'git',
      url: repo.web_url,
      owner: repo.owner,
      repo: repo.http_url_to_repo,
      pull_requests: 'none',
      whitelist: []
    }
  }
}