
const express = require('express');
require('dotenv').config();
const app = express();
const jwt = require('jsonwebtoken');
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const user = {
    username: 'test',
    role : 'admin',
    password: 'test'
};
const secret = process.env.SECRET;

app.get('/', (req, res) => res.send('Hello World!'));


app.get('/user', (req, res) => {
    let token = getBearerTokenFromHeader(req.headers.authorization);
    let decoded = jwt.verify(token, secret);
   if (isLogged(token) && decoded.role == "admin") res.send(user);
    else if (isLogged(token)) res.send('pas admin');
});

const getBearerTokenFromHeader = (authToken) => {
    return authToken.split(" ")[1]
  }

function isLogged (token){
    return jwt.verify(token, secret, function(err) {
        if (err) {
            console.log(err);
            return false;
        }
        return true;
      });
}



app.get('/checkToken', (req, res) => {
    console.log(req.query.token);
    var decoded = jwt.verify(req.query.token,secret);
     res.send(decoded);
});

app.post('/login', (req, res) => {
    console.log(req.body);
    if (req.body.username == user.username && req.body.password == user.password) {
        const token = jwt.sign(user, secret);
        res.send(token);
    } else {
        res.send('incorrect username or password');
    }
});

app.listen(port, () => console.log(`app sur le port ${port}!`));
