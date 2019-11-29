const userApi = require('./api/mysql.api');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// 全局的路由匹配
app.use((req, res, next) => {
    // 排除登陆注册页面
    if (req.url !== '/api/todoList/userLogin' && req.url !== '/api/todoList/upload') {
        // 不同形式获取token值
        let token = req.headers.authorization || req.query.token || req.body.token;
        // 如果存在token ---- 验证
        if (token) {
            jwt.verify(token, 'canoe', function(err, decoded) {
                if (err) {
                    return res.status(403).send({error: 'Internal server error happened'})
                } else {
                    req.decoded = decoded;
                    next();
                }
            })
        } else { // 不存在 - 告诉用户---意味着未登录
            return res.status(401).send({error: 'Internal server error happened'})
        }
    } else{
        next();
    }
})

app.use('/api/todoList', userApi);

app.listen(3001);
console.log('server is open ! success listen at port: 3001 ~');
