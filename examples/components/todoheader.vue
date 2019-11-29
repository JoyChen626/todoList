<template>
    <header class="" :style="{background: this.$store.state.activeTheme.color}">
        <div class="title">记事本
            <div class="box">
                <img class="userphoto" :src="require('../../server/uploadFiles/file/'+userid+'.jpg')" alt="">
                <span class="username">{{username}}</span>
            </div>
            <a class="t-btn" @click="showTools"><span></span></a>
        </div>
    </header>
</template>
<script>
    import {apigetUser} from '../api/api'
    export default {
        name:'todoheader',
        data () {
            return {
                status: this.$store.state.shownav,
                userid: this.$store.state.userid,
                username:this.$store.state.username,
            }
        },
        mounted(){},
        methods: {
            showTools(){
                this.$store.commit('CHANGE_NAV',!this.status);
            }
        },
        computed:{
            newStatus(){return this.$store.state.shownav}
        },
        watch:{
            newStatus(val){this.status = val}
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    header{
        width:100%;
        height:70px;
        .title{
            position: relative;
            width:100%;
            max-width:800px;
            margin:0 auto;
            line-height: 70px;
            text-align: center;
            color: #fff;
            .box{
                position: absolute;
                top: 0;
                left: 0;
                width: 100px;
                height: 70px;
                .userphoto{
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    margin-top: 10px;
                }
                .username{
                    position: absolute;
                    width: 100%;
                    bottom: 0;
                    left: 0;
                    font-size: 14px;
                    color: #ffffff;
                    font-weight: bold;
                    height: 20px;
                    line-height: 20px;
                    margin-bottom: 5px;
                }
            }
            a.t-btn{
                position: absolute;
                right:10px;
                top:22px;
                width:30px;
                height:26px;
                cursor: pointer;
                span,span:before,span:after{
                    position: absolute;
                    left:0;
                    width:30px;
                    height:4px;
                    content: '';
                    background: #fff;
                }
                span{
                    top:11px;
                    &:before{
                        top:0;
                        transform: translateY(-7px);
                        transition: all .3s;
                    }
                    &:after{
                        transform: translateY(7px);
                        transition: all .3s;
                    }
                }
            }
        }
    }
</style>
