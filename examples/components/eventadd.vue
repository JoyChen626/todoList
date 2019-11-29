<template>
    <div class="event-add">
        <el-input placeholder="请输入待办事项" v-model="content" @keyup.enter="submit">
            <template slot="append" @click="submit">提交</template>
        </el-input>
    </div>
</template>

<script>
    import {apiaddThing} from '../api/api'
    export default {
        data () {
            return {
                content: '',
                btnClock: false
            }
        },
        methods: {
            submit () {
                if(this.btnClock){return false}
                if(this.content == ''){
                    return false;
                }
                this.btnClock = true;
                apiaddThing({thing:this.content,userid:this.$store.state.userid}).then( res => {
                    this.btnClock = false;
                    if(res.code == 0){

                    }
                })
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .event-add{
        position: relative;
        padding:30px 90px 30px 0;
        font-size: 16px;
        .n-input{
            width:100%;
            height:40px;
            padding:7px 10px;
            line-height: 26px;
            border:1px solid #c0ccda;
            border-radius:4px;
            transition: border-color .2s cubic-bezier(.645,.045,.355,1);
            box-sizing: border-box;
            font-size:inherit;
            &:focus {
                outline: none;
            }
        }
        .add-btn{
            width:80px;
            height:30px;
            line-height: 26px;
            color: #fff;
        }
    }
</style>
