var querystring = require('querystring'),
    http = require('http'),
    compileErrorTest = /^error\([^\)]+?\):/i;

function compile(source, level, callback) {
  var post_data, opts, req;
  
  post_data = querystring.stringify({
    'compilation_level': level || 'SIMPLE_OPTIMIZATIONS',
    'output_format': 'text',
    'output_info': 'compiled_code',
    'warning_level': 'QUIET',
    'js_code': source
  });
  
  if (level === 'WHITESPACE_ONLY') {
    post_data = 'formatting=pretty_print&' + post_data;
  }
  
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
      var error = null;
      if (compileErrorTest.test(results)) {
        error = {
          message: results
        }
      }
      callback && callback(error, results);
    });
  });
  req.write(post_data + '\n');
  req.end();
}

exports.compile = compile;