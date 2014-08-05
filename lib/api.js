var request = require('superagent')

module.exports = {
  get: get,
  get_r: get_r,
  parseRepo: parseRepo
}

function get(config,content,callback) {

  if (content.indexOf("?") == -1){
    var link = "?";
  } else {
    var link = "&";
  }

  var url = config.api_url + '/' + content + link + 'private_token=' + config.api_key + '&per_page=100';
  request.get(url, function(err, res){
      callback(err,res.text);
    });
}


function get_r(config,content,callback) {

  if (content.indexOf("?") == -1){
    var link = "?";
  } else {
    var link = "&";
  }

  var text = "";
  var count = 0;
  
  var recursive_get = function (page,parent_text,done){
    var per_page = 100;
    var url = config.api_url + '/' + content + link + 'private_token=' + config.api_key + '&page='+page+'&per_page='+per_page;
    console.log(url);
    request.get(url, function(err, res){
      if(err){
        done(err);
      }
      if(text!=""){
	if (res.text != "[]"){
   	  parent_text = parent_text.substring(0, parent_text.length - 1);
          text = parent_text + ',' + res.text.substring(1, res.text.length);
        }
      }else{
        text = res.text;
      }
      var count = res.body.length;
      if(count >= per_page && count !=0){
        page++;
        recursive_get(page, text, function(err){
          done(err);
        });
      }else{
        done(err);
      }
    });
  };

  recursive_get(1,text,function(err){
    callback(err,text);
  });

}
  
function parseRepo(repo) {
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
