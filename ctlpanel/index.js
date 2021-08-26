const express = require('express');
const bodyParser = require('body-parser')
const { execSync } = require('child_process');

const app = express();
app.use(express.static('htdocs'));
const jsonParser = bodyParser.json()

const targetContainerName = process.env.TARGET_CONTAINER_NAME;

function getUsers(){
  const resultRaw = execSync(`docker exec ${targetContainerName} find /config/data/meet%2ejitsi/accounts -type f -exec basename {} .dat \\;`).toString();
  const resultLine = resultRaw.split('\n').filter((r)=>r.length > 0).sort();
  return resultLine;
}

function registerUser(username, password){
  execSync(`docker exec ${targetContainerName} prosodyctl --config /config/prosody.cfg.lua register "${username}" meet.jitsi "${password}"`);
}

function deleteUser(username){
  execSync(`docker exec ${targetContainerName} prosodyctl --config /config/prosody.cfg.lua unregister "${username}" meet.jitsi`);
}


app.get('/users', function (req, res) {
  const users = getUsers();
  res.send(users)
})

app.post('/user/new', jsonParser, function (req, res) {
  if(!req.body.username || req.body.username.match(/[^a-zA-Z0-9_]/)){
    res.status(400).send({
      statusCode: -1,
      message: 'bad request'
    })
    return;
  }
  if(!req.body.password || req.body.password.match(/[^a-zA-Z0-9_]/)){
    res.status(400).send({
      statusCode: -1,
      message: 'bad request'
    })
    return;
  }
  registerUser(req.body.username, req.body.password);
  res.send({
    statusCode: 0,
    message: 'OK'
  })
})

app.post('/user/delete', jsonParser, function (req, res) {
  if(!req.body.username || req.body.username.match(/[^a-zA-Z0-9_]/)){
    res.status(400).send({
      statusCode: -1,
      message: 'bad request'
    })
    return;
  }
  deleteUser(req.body.username);
  res.send({
    statusCode: 0,
    message: 'OK'
  })
})

app.listen(3000, () => {})
