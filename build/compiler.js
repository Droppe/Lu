var querystring = require('querystring'),
    http = require('http');

function compile(source, level, callback) {
  var post_data, opts, req;
  
  post_data = querystring.stringify({
    'compilation_level': level || 'SIMPLE_OPTIMIZATIONS',
    //'formatting': level === 'WHITESPACE_ONLY' ? 'pretty_print' : '',
    'output_format': 'text',
    'output_info': 'compiled_code',
    'warning_level': 'QUIET',
    'js_code': source
  });
  
  opts = {
    host:'closure-compiler.appspot.com',
    port: 80,
    path:'/compile',
    method:'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    }
  };
  
  req = http.request(opts, function(res) {
    var results = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      results += chunk.toString();
    });
    res.on('end', function () {
      callback && callback(results);
    });
  });
  req.write(post_data + '\n');
  req.end();
}

exports.compile = compile;