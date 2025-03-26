const utils = require('src/utils');
const express = require('express');
const app = express();

const PASSWORD_NAME = "password";
const CONFIRM_PASSWORD_NAME = "confirmpassword";

app.use(express.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === utils.getUser1() && password === utils.getPassword1()) {
    res.send(`<h1>Welcome ${username} to the website</h1>`);
  }
  else if(username === utils.getUser2() && password === utils.getPassword2()){
    res.send(`<h1>Welcome ${username} to the website</h1>`);
  }else {
    res.send('<h1>Login Error</h1>');
  }
});

app.get('/user1', (req, res) => {
  res.send({
    user: utils.getUser1(),
    pass: utils.getPassword1()
  });
});

app.get('/page1', (req, res) => {
  var user = utils.getUser1()
  var pass = utils.getPassword1()
  const html = `
    <body>
      <h1>User Details</h1>
      <p>User: ${user}</p>
      <p>Password: ${pass}</p>
    </body>
  `
  res.send(html);
});

app.get('/page2', (req, res) => {
  var user = utils.getUser2()
  var pass = utils.getPassword2()
  const html = `
      <body>
        <h1>User Details</h1>
        <p>User: ${user}</p>
        <p>Password: ${pass}</p>
      </body>
    `
  res.send(html);
});

app.get('/page2', (req, res) => {

  const html = `
      <body>
        <p>Confirm: ${CONFIRM_PASSWORD_NAME}</p>
        <p>Password: ${PASSWORD_NAME}</p>
      </body>
    `
  res.send(html);
});
