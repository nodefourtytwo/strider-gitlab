var request = require('superagent')

module.exports = {
  get: get,
  parseRepo: parseRepo
}

function get(config,content,callback) {

  var url = config.api_url + '/' + content + '?private_token=' + config.api_key;

  request.get(url, function(err, res){
      if (err) throw next(err);
      callback(JSON.parse(res.text));
    });
}

function parseRepo(repo) {
  console.log(repo)
  return {
    id: repo.id,
    name: repo.name,
    display_name: repo.name,
    display_url: repo.name,
    group: repo.owner,
    private: !repo.public,
    config: {
      auth: { type: 'https' },
      scm: repo.scm,
      url: repo.name,
      owner: repo.owner,
      repo: repo.name,
      pull_requests: 'none',
      whitelist: []
    }
  }
}