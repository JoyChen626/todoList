<template>
    <div class="myEdit">
        <todoheader></todoheader>
        <div class="box">
            <div class="logo-box">
                <span class="bj" v-show="showphoto" @click="changephoto()" v-if="showphoto">编辑</span>
                <el-image style="width: 88px; height: 88px" :src="userphoto" fit="fit" v-if="showphoto"></el-image>
                <el-upload v-if="!showphoto" class="avatar-uploader" :action="action" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeRead">
                    <img v-if="userphone" :src="userphone" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </div>
            <p>{{username}}</p>
            <p>{{userphone}}</p>
        </div>
        <todofooter></todofooter>
    </div>
</template>

<script>
    import {apigetUser} from '../api/api'
    export default {
        name: "myEdit",
        data(){
            return{
                fileList:[],
                username:'',
                userphone:'',
                userphoto:'',
                showphoto: true,
                action: ''
            }
        },
        mounted(){
            apigetUser({userid:this.$store.state.userid}).then(res => {
                this.username = res[0].username;
                this.userphone = res[0].userphone;
                return false
                this.userphoto = require('../../server/'+res[0].userphoto);

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
            changephoto(){
                this.showphoto = false;
            },
            // 文件上传
            onchange (){
                let formData = new FormData;
                formData.append('file',this.fileList[0].file);
                formData.append('userid',this.$store.state.userid);
                const instance= axios.create({
                    withCredentials: true
                })
                instance.post('/api/todoList/upload', formData)
                    .then(res => {
                       if(res.data.code == 0){
                           this.$notify({ type: 'primary', message: '上传成功', duration: 2000 });
                           return false
                       }
                    })
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
        text-align: center;
        margin: 60px 0 0 0;
        position: relative;
        .bj{
            position: absolute;
            line-height: 30px;
            height: 30px;
            width: 60px;
            border: 1px solid #ffffff;
            text-align: center;
            font-size: 14px;
            color: #ffffff;
            top: 50%;
            left: 50%;
            margin-left: -30px;
            margin-top: -15px;
            z-index: 99;
            cursor: pointer;
        }
    }
    p{
        text-align: center;
        line-height: 30px;
        height: 30px;
        font-size: 14px;
    }
</style>
