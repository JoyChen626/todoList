const userApi = require('./api/mysql.api');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use('/api/todoList', userApi);

app.listen(3001);
console.log('server is open ! success listen at port: 3001 ~');
