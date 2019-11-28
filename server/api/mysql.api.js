var models = require('../mysql/sql.config');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../mysql/sql.map');
var fs = require('fs');
var multer = require('multer');
// 设置文件缓存的目录
var upload = multer({ dest: '../../uploadFiles/tmp/'});
//var globalObj = require('../../config'); //目录地址

//验证码
var verificationCode = '';

var conn = mysql.createConnection(models.mysql);

conn.connect(); //链接数据库

var jsonWrite = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.send('err');
    } else {
        res.send(ret);
    }
}

var dateStr = function(str) {
    return new Date(str.slice(0,7));
}

/***
 * user表
 * ***/
// 增加用户接口
router.post('/addUser', (req, res) => {
    var sql = $sql.user.add;
    var params = req.body;
    if(params.password !== params.password2) {
        res.send({code:-1,msg:'两次输入的密码不一致'});
        return false;
    } else if (params.sms !== verificationCode){
        res.send({code:-1,msg:'验证码有误'});
        return false;
    }
    conn.query("select * from user where username ='" + params.username+"'", params.username,function (err,result) {
        if (err) {
            console.log(err);
        }
        if (result[0] !== undefined) {
            res.send({code:-1,msg: '此用户名已存在'})
        } else {
            conn.query("select * from user where userphone ='" + params.userphone+"'", params.userphone,function (err2,result2) {
                if (err2) {
                    console.log(err2);
                }
                if (result2[0] !== undefined) {
                    res.send({code:-1,msg: '此手机号已被占用'})
                } else {
                    conn.query(sql, [params.username, params.password, params.userphone], function(err3, result3) {
                        if (err3) {
                            console.log(err3);
                        }
                        if (result3) {
                            //注册成功 =》登录
                            conn.query('select * from user where username ='+params.username, params.username, function(err4, result4) {
                                if (err4) {
                                    console.log(err4);
                                }
                                if (result4[0] === undefined) {
                                    res.send({code:-1,msg:'无此用户名'})
                                } else {
                                    var resultArray = result4[0];
                                    res.send({code:0,msg: '注册成功',userid:resultArray.userid,token: str_add(randomString(32,'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'),8,'-')})
                                }
                            })
                        }
                    })
                }
            })
        }
    })
});

//发送验证码
router.get('/verificationCode', (req, res) => {
    var params = req.query;
    if (params.userphone == '') {
        res.send({code:-1,msg:'手机号不能为空'});
        return false
    } else {
        conn.query("select * from user where userphone ='" + params.userphone+"'", params.userphone,function (err2,result2) {
            if (err2) {
                console.log(err2);
            }
            if (result2[0] !== undefined) {
                res.send({code:-1,msg: '此手机号已被占用'})
            } else {
                verificationCode = randomString(6,'1234567890');
                res.send({code:0,verificationCode:verificationCode});
            }
        })
    }
});

//登录
router.post('/userLogin', (req, res) => {
    var sql_user = $sql.user.select_user;
    var params = req.body;
    if (params.username) {
        sql_user += "where username ='"+ params.username +"'";
    }
    conn.query(sql_user, params.username, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result[0] === undefined) {
            res.send({code:-1,msg:'用户名无效'})
        } else {
            var resultArray = result[0];
            if(resultArray.password === params.password) {
                res.send({code:0,msg: '登录成功',userid:resultArray.userid,token: str_add(randomString(32,'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'),8,'-')})
            } else {
                res.send({code:-1,msg:'密码错误'})
            }
        }
    })
});

//获取用户信息
router.get('/getUser', (req, res) => {
    var sql_user = $sql.user.select_user;
    var params = req.query;
    if (params.userid) {
        sql_user += "where userid = "+ params.userid;
    }
    conn.query(sql_user, params.userid, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result[0] === undefined) {
            res.send({code:-1,msg:'无效用户'})
        } else {
            jsonWrite(res, result);
        }
    })
});

//更新用户信息
router.post('/updateUser', (req, res) => {
    var sql_update = $sql.user.update_user;
    var params = req.body;
    if (params.userid) {
        sql_update  += "username = '" + params.username +
            "',userphone = '" + params.userphone +
            "',userphoto = '" + params.userphoto +
            "' where userid ='"+ params.userid + "'";
    }
    conn.query(sql_update, params.userid, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result.affectedRows === undefined) {
            res.send({code:-1,msg:'更新失败，请联系管理员'})
        } else {
            res.send({code:0,msg:'ok'});
        }
    })
});

//更改密码
router.post('/modifyPassword', (req, res) => {
    var sql_modify = $sql.user.update_user;
    var params = req.body;
    if (params.userid) {
        sql_modify +=  "password = '" + params.password +
            "' where userid ='"+ params.userid + "'";
    }
    conn.query(sql_modify, params.userid, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result.affectedRows === undefined) {
            res.send({code:-1,msg:'修改密码失败，请联系管理员'})
        } else {
            res.send({code:0,msg:'ok'});
        }
    })
});

/***
 * thing表
 * ***/
//获取列表数据
router.get('/getThings', ( req, res) => {
    var params = req.query;
    var sql_thing = $sql.thing.get + 'where userid = ' + params.userid;
    conn.query(sql_thing, [params.userid], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result.length==0) {
            res.send({code:0,list1:[],list2:[],list3:[]});
        } else {
            var list1 = [];
            var list2 = [];
            var list3 = [];
            for (var i in result){
                if(result[i].status == 1){
                    list1.push(result[i]);
                }
                if(result[i].status == 2){
                    list2.push(result[i]);
                }
                if(result[i].status == 3){
                    list3.push(result[i]);
                }
            }
            list1.sort(function(a,b){
                return a.create_at > b.create_at ? 0 :1
            });
            list2.sort(function(a,b){
                return a.done_at > b.done_at ? 0 :1
            });
            list3.sort(function(a,b){
                return a.remove_at > b.remove_at ? 0 :1
            });
            res.send({code:0,list1:list1,list2:list2,list3:list3});
        }
    })
});

router.get('/getoneThings', ( req, res) => {
    var params = req.query;
    var start = (params.pageIndex - 1) * params.pageCount;
    var sql_thing = $sql.thing.get + 'where userid = ' + params.userid + ' and status = '+params.status;
    conn.query(sql_thing, [params.userid,params.status], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result.length==0) {
            res.send({code:0,list:[],total: 0});
        } else {
            var total = result.length;
            conn.query(sql_thing + ' limit ' + start + ','+params.pageCount, [params.userid,params.status], function(err1, result1) {
                if (err1) {
                    console.log(err1);
                }
                result1.sort(function(a,b){
                    return params.status == 1 ?(a.create_at > b.create_at ? 0 :1):params.status == 2 ?(a.done_at > b.done_at ? 0 :1):(a.remove_at > b.remove_at ? 0 :1);
                });
                res.send({code:0,list:result1,total: total});
            })
        }
    })
});

//添加待做事项
router.post('/addThing', (req, res) => {
    var sql_addThing = $sql.thing.add;
    var params = req.body;
    var time = getTime();
    var status = 1;
    conn.query(sql_addThing, [params.userid,params.thing,time,status], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result === undefined) {
            res.send({code:-1,msg:'添加失败，请联系管理员'})
        } else {
            res.send({code:0,msg:'ok'});
        }
    })
});

//更新thing状态
router.post('/updateThing', (req, res) => {
    var sql_update = $sql.thing.updata_thing;
    var params = req.body;
    var time = getTime();
    if(params.status == 1){
        sql_update  += "status = " + params.status + ", done_at = '" + time +
            "' where id = "+ params.id + " and userid = "+params.userid;
    } else {
        sql_update  += "status = " + params.status + ", remove_at = '" + time +
            "' where id = "+ params.id + " and userid = "+params.userid;
    }
    conn.query(sql_update, params.status, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result === undefined) {
            res.send({code:-1,msg:'更新失败，请联系管理员'})
        } else {
            res.send({code:0,msg:'ok',update_at:time});
        }
    })
});

//删除thing
router.post('/deleteThing', (req, res) => {
    var sql_delete = $sql.thing.delete_thing;
    var params = req.body;
    sql_delete  += "where id ="+ params.id + " and userid = "+params.userid;

    conn.query(sql_delete, [params.id,params.userid], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result === undefined) {
            res.send({code:-1,msg:'删除失败，请联系管理员'})
        } else {
            res.send({code:0,msg:'ok'});
        }
    })
});

// 文件上传
router.post('/upload', upload.array('file'),function(req, res) {
    // 文件信息
    var params = req.body;
    let reqData = req.files[0];
    var index = reqData.originalname.lastIndexOf(".");
    reqData.originalname = params.userid + reqData.originalname.substring(index, reqData.originalname.length);
    var des_file =  "uploadFiles/file/" + reqData.originalname;
    fs.readFile(reqData.path, function (error, data) {
        if (error) {
            console.error(error);
        }
        fs.writeFile(des_file, data, function (err) {
            if (err) {
                console.log(err);// 接收失败
            }else {
                // 接收成功
                // 删除缓存文件
                fs.unlink(reqData.path, function(err){
                    if (err){
                        console.log('文件:'+reqData.path+'删除失败！');
                    }
                })
                var sql_update = $sql.user.update_user + "userphoto = '" + des_file +"' where userid = " + params.userid;
                conn.query(sql_update , params.userid, function(err1, result1) {
                    if (err1) {
                        console.log(err1);
                    }
                    if (result1 === undefined) {
                        res.send({code:-1,msg:'上传失败，请联系管理员'})
                    } else {
                        res.send({code:0,msg:'ok'});
                    }
                })
            }
        })
    })
});

function randomString(len,str){
    len = len || 32;
    var $chars = str;    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
function str_add(str,length,pvalue){
    var result = '';
    for(var i=0,len=str.length; i<len; i+=length){
        result+=str.slice(i,i+length) + pvalue;
    }
    var news = result.slice(0,result.length-1);
    return news;
}
function getTime(){
    var myDate = new Date();
    var YY = myDate.getFullYear();
    var MM = myDate.getMonth()+1>9?myDate.getMonth()+1:'0'+myDate.getMonth()+1;
    var DD = myDate.getDate()>9?myDate.getDate():'0'+myDate.getDate();
    var hh = myDate.getHours()>9?myDate.getHours():'0'+myDate.getHours();
    var mm = myDate.getMinutes()>9?myDate.getMinutes():'0'+myDate.getMinutes();
    var ss = myDate.getSeconds()>9?myDate.getSeconds():'0'+myDate.getSeconds();
    var time = YY + '-' + MM + '-' + DD + ' ' + hh + ':' + mm +':' + ss;
    return time;
}
module.exports = router;
