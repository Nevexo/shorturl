var fs = require('fs')
var randomstring = require('randomstring')
var express = require('express')
var server = express()
var config = require('./config.json')
var dockServer = express()
var jsonObj = require('./lookup.json')
server.use(function(req,res,next){
  res.header("X-Powered-By", "Nevexo's Amazing Linker shortner https://nevexo.space <3");
  next()
})

function updateFile(){
  fs.writeFileSync('./lookup.json', JSON.stringify(jsonObj));
};

server.get('/', function(req, res) {
  res.send('Docker-ready link shortner by <a href="https://nevexo.space">Nevexo</a>')
});

server.get('/:url', function(req, res) {
  var url = req.params.url;

console.log('[SERV] Looking up : ' + url)
  var verified = false;
  var loop = 0
  if (Object.keys(jsonObj).length == 0) {
    res.send('No shortURLs registered, <a href="/admin/ui">Set some</a>')
  }
  for(var key in jsonObj) {
    loop = loop +1
     if (key == url) {
       console.log('[SERV] URL Found! ' + jsonObj[key] + ' redirecting...')
       verified = true;
       res.redirect(jsonObj[key])
     }
     if (loop == Object.keys(jsonObj).length) {
       if (verified == false) {res.status(404)
       res.send("URL doesn't exist.")}
     }
  }
})

server.get('/admin/viewURLs', function(req, res) {
  if (req.query.token == config.adminToken) {
    res.send(jsonObj)
  }else {
    res.redirect('/admin/ui?status=INVALIDTOKEN')
  }
})

server.get('/admin/newURL', function (req, res) {
  if (req.query.token == undefined) {res.redirect('/admin/ui?status=INVALIDTOKEN')} else {
    if (req.query.token == config.adminToken) {
      if (req.query.full == undefined) {res.status('418')
      res.send('ERROR: INVALIDQUERY')} else{
        if (req.query.short == "") {
          var short = randomstring.generate(7)
        }else {var short = req.query.short}
        console.log('New short: ' + short)
          if(jsonObj.hasOwnProperty(short)){
            res.status(418)
            res.send('ERROR:DUPE')
          }else {
            console.log('[INFO] Creating new shortURL: ' + short + " => " + req.query.full)
            jsonObj[short] = req.query.full
            updateFile()
            res.redirect('/admin/ui?status=NEWURL&url=' + short)
        }
      }
    }else {
      res.redirect('/admin/ui?status=INVALIDTOKEN')
    }
  }

});

server.get('/admin/ui', function(req, res) {
  res.sendFile('index.html', {root: __dirname })
})

server.get('/admin/newToken', function(req, res) {
  if (req.query.token == config.adminToken) {
    if (req.query.newToken == "") {
      config.adminToken = randomstring.generate(30)
      fs.writeFileSync('./config.json', JSON.stringify(config));
      res.redirect('/admin/ui?status=NEWRANDOMTOKEN&token=' + config.token)
    }else {
      config.adminToken = req.query.newToken
      fs.writeFileSync('./config.json', JSON.stringify(config));
      res.redirect('/admin/ui?status=TOKENSET')
    }

  }else {
      res.redirect('/admin/ui?status=INVALIDTOKEN')
  }
})

server.get('/admin/customToken', function(req, res) {
  //TODO
})

dockServer.get('/', function(req, res) {
  res.send(config.adminToken)
})

if (config.adminToken == 'UNSET') {
  config.adminToken = randomstring.generate(30)
  console.log("[FRONTEND] Created token: " + config.adminToken)
  fs.writeFileSync('./config.json', JSON.stringify(config));
}

if (config.spinupDockerResetServer) {
  dockServer.listen(config.dockerResetPort, function() {
    console.log('[CAUTION] DOCKER TOKEN RESET SERVER IS ACTIVE, IF THE PORT IS NOT CLOSED ANYONE CAN SEE THE ADMIN TOKEN, IF YOU ARE NOT USING DOCKER TURN THIS OFF IN CONFIG NOW.')
  })
}

server.listen(80, function() {
  console.log("Server ready.  ")
})
