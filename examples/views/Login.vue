<template>
    <div class="Login">
        <div class="box">
            <div class="logo-box">
                <el-image style="width: 100px; height: 100px" src="https://img.yzcdn.cn/vant/cat.jpeg" :fit="cover"></el-image>
            </div>
            <div class="center">
                <div class="input-box">
                    <el-form label-width="100px">
                        <el-form-item label="用户名">
                            <el-input v-model="username" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="password" placeholder="请输入密码"></el-input>
                        </el-form-item>
                        <div  v-if="type == 0">
                            <el-form-item label="确认密码">
                                <el-input v-model="password2" placeholder="请再次输入密码"></el-input>
                            </el-form-item>
                            <el-form-item label="手机号">
                                <el-input v-model="userphone" placeholder="请输入手机号"></el-input>
                            </el-form-item>
                            <el-form-item label="短信验证码">
                                <el-input placeholder="请输入短信验证码" v-model="sms">
                                    <template slot="append" @click="sendSMS()" v-if="count==60||count==0">{{count==60?'发送验证码':'再次发送'}}</template>
                                    <template slot="append" disabled v-else>{{count+'s后重新发送'}}</template>
                                </el-input>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
            </div>
            <div class="btn-box">
                <el-button class="btn" type="primary" @click="btn_click()">{{type == 1?'登录':'注册'}}</el-button>
            </div>
            <div class="toRegister clear">
                {{type == 1?'没有':'已有'}}账号？
                <span class="right" @click="change_type()">{{type == 1?'去注册':'去登录'}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex';
    import {apiLogin,apiGetCode,apiAddUser} from '../api/api';
    export default {
        name: "Login",
        data () {
            return {
                type: 1,
                username: '',
                password: '',
                password2:'',
                userphone:'',
                errmsg:'',
                sms:'',
                count: 60,
                imgObj: {},
                btnClock: false
            }
        },
        methods: {
            ...mapMutations({'save_userinfo':'SAVE_USER','set_token': 'SET_TOKEN'}),
            change_type(){
                this.type = this.type == 1 ? 0 : 1;
            },
            btn_click () {
                if(this.btnClock){return false}
                if(this.type == 1) {
                    if (this.username == '' && this.password == '') {
                        this.$message({message: '用户名、密码不能为空！', type: 'warning'});
                        return false;
                    } else if(this.username == ''){
                        this.$message({message: '用户名不能为空！', type: 'warning'});
                        return false;
                    } else if (this.password == '') {
                        this.$message({message: '密码不能为空！', type: 'warning'});
                        return false;
                    }
                    apiLogin({username: this.username,password: this.password})
                        .then((res) => {
                            if (res.code == 0) {
                                this.btnClock = true;
                                this.set_token(res.token);
                                this.save_userinfo(res.userid);
                                this.$message({message: '登录成功！', type: 'success'});
                                var self = this;
                                setTimeout( () => {
                                    self.$router.push({path: '/home'});
                                },2000)
                            } else {
                                this.$alert(res.msg+'！', '提示', {confirmButtonText: '确定'});
                            }
                        })
                } else{
                    var self = this;
                    if(this.username == ''||this.password == ''||this.password2 == ''||this.userphone == ''||this.sms == ''){
                        this.$message({message: '必填项不能为空！', type: 'warning'});
                        return false;
                    } else {
                        var sendData = {};
                        sendData.username=this.username;
                        sendData.password=this.password;
                        sendData.password2=this.password2;
                        console.log(this.userphone)
                        if(this.validatePhone(this.userphone) == true){
                            sendData.userphone=this.userphone;
                            this.errmsg = ''
                        }else {
                            this.errmsg = this.validatePhone(this.userphone);
                            return false;
                        }
                        sendData.sms=this.sms;
                        apiAddUser(sendData).then( (res) => {
                            if(res.code == 0) {
                                this.$message({message: '注册成功，将为您自动登录！', type: 'success'});
                                this.set_token(res.token);
                                this.save_userinfo(res.userid);
                                setTimeout( () =>{
                                    self.$router.push({path:'/home'});
                                },2000)
                            } else {
                                this.$alert(res.msg+'！', '提示', {confirmButtonText: '确定'});
                            }
                        })
                    }
                }
            },
            sendSMS(){
                if(this.validatePhone(this.userphone) == true){
                    this.errmsg = '';
                    apiGetCode({userphone:this.userphone}).then( res => {
                        if(res.code == 0){
                            if(this.count == 60){
                                this.cutCount();
                            } else if (this.count ==0){
                                this.count = 59;
                                this.cutCount();
                            }
                        } else {
                            this.$alert(res.msg+'！', '提示', {confirmButtonText: '确定'});
                        }
                    })
                }else {
                    this.errmsg = this.validatePhone(this.userphone);
                }
            },
            cutCount(){
                var self = this;
                setTimeout( function () {
                    self.count --;
                    if(self.count>0){
                        self.cutCount();
                    }
                },1000);
            },
            validatePhone(value) {
                const reg =/^[1][3-9][0-9]{9}$/;
                if (value == '' || value == undefined || value == null) {
                    return false;
                } else {
                    if ((!reg.test(value)) && value != '') {
                        return '请输入正确的电话号码';
                    } else {
                        return true;
                    }
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .Login{
        position: relative;
        width: 100%;
        height: 100%;
        .box{
            width: 360px;
            position: absolute;
            top:50%;
            left:50%;
            transform:translate(-50%,-50%);
        }
        .logo-box{
            text-align: center;
            padding: 0 0 30px 0;
        }
        .input-box{
            margin-bottom: 40px;
        }
        .btn-box{
            text-align: center;
            .btn{
                width: 100%;
                height: 40px;
                line-height: 14px;
                font-size: 16px;
            }
        }
        .toRegister{
            line-height: 40px;
            height: 40px;
            color: #999999;
            font-size: 16px;
            span{
                cursor: pointer;
                vertical-align: top;
                text-decoration: underline;
            }
        }
    }
</style>
