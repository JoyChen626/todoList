<template>
    <div class="myEdit">
        <todoheader></todoheader>
        <div class="box">
            <div class="logo-box">
                <p>点击头像更新</p>
                <el-upload class="avatar-uploader" :action="action" :data="datas" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeRead">
                    <img style="width: 100px; height: 100px" :src="require('../../server/uploadFiles/file/'+userid+'.jpg')" class="avatar">
                </el-upload>
            </div>
            <p><span class="word">{{username}}</span><span class="edit" @click="toEdit()">编辑</span></p>
            <p>{{userphone}}</p>
        </div>
        <todofooter></todofooter>
        <el-dialog title="修改昵称" :visible.sync="dialogFormVisible" width="400px" center>
            <el-form label-width="65px" @submit.native.prevent>
                <el-form-item label="新昵称">
                    <el-input v-model="newname" placeholder="请输入新昵称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateName()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {apigetUser,apiupdateUser} from '../api/api'
    export default {
        name: "myEdit",
        data(){
            return{
                userid:this.$store.state.userid,
                username:this.$store.getters.newname,
                newname: '',
                userphone:'',
                userphoto:'',
                showphoto: true,
                action: '/api/todoList/upload',
                datas: {userid: this.$store.state.userid},
                dialogFormVisible:false
            }
        },
        mounted(){
            apigetUser({userid:this.$store.state.userid}).then(res => {
                this.userphone = res[0].userphone;
            })
        },
        methods:{
            beforeRead(file) {
                if (file.type !== 'image/jpeg' && file.type !== 'image/png'&& file.type !== 'image/gif') {
                    console.log('照片格式不正确');
                    return false;
                }
                return true;
            },
            handleAvatarSuccess (data){
                if(data.code == 0){
                    this.$message({message: '上传成功！', type: 'success'});
                    return false
                }
            },
            toEdit(){
                this.dialogFormVisible = true;
                this.newname = this.username;
            },
            updateName(){
                if(this.username == ''){
                    this.$message({message: '昵称不能为空！', type: 'warning'});
                    return false;
                } else {
                    apiupdateUser({username: this.newname,userid: this.userid}).then( res => {
                        if(res.code == 0){
                            this.username = this.newname;
                            this.dialogFormVisible = false;
                            this.$store.commit('CHANGE_NAME',this.username);
                            this.$message({message: '更新成功！', type: 'success'});
                        } else {
                            this.$message({message: res.msg +'!', type: 'error'});
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .box{
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
    }
    .logo-box{
        width: 100px;
        text-align: center;
        margin: 60px auto 0 auto;
        position: relative;
        p{
            height: 30px;
            line-height: 30px;
            text-align: center;
            font-size: 12px;
            color: white;
            background: rgba(0,0,0,.5);
            position: absolute;
            left: 0;
            bottom: 4px;
            width: 100%;
        }
    }
    p{
        text-align: center;
        line-height: 30px;
        height: 30px;
        font-size: 14px;
        .word{
            min-width: 10%;
            text-align: right;
        }
        .edit{
            text-decoration: underline;
            margin-left: 10px;
            font-size: 12px;
            color: lightcoral;
            cursor: pointer;
        }
    }
</style>
