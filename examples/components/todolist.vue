<template>
    <div class="todolist">
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item name="1">
                <template slot="title">
                    未完成<i class="header-icon el-icon-info"></i>
                </template>
                <ul v-if="list1.length>0">
                    <li v-for="(item,index) in list1" :key="index" class="clear">
                        <p class="left">{{item.thing}}</p>
                        <p class="right">{{item.create_at}}</p>
                        <el-button class="right" size="small" type="danger" @click="to_remove(item,index)">取消</el-button>
                        <el-button class="right" size="small" type="primary" @click="to_done(item,index)">完成</el-button>
                    </li>
                </ul>
                <p class="kong-tip" v-if="list1.length==0">暂无待做事项</p>
            </el-collapse-item>
            <el-collapse-item name="2">
                <template slot="title">
                    已完成<i class="header-icon el-icon-info"></i>
                </template>
                <ul v-if="list2.length>0">
                    <li v-for="(item,index) in list2" :key="index" class="clear">
                        <p class="left">{{item.thing}}</p>
                        <p class="right">{{item.done_at}}</p>
                        <el-button class="right" size="small" type="danger" @click="to_remove(item,index)">取消</el-button>
                    </li>
                </ul>
                <p class="kong-tip" v-if="list2.length==0">暂无已完成事项</p>
            </el-collapse-item>
            <el-collapse-item name="3">
                <template slot="title">
                    已取消<i class="header-icon el-icon-info"></i>
                </template>
                <ul v-if="list3.length>0">
                    <li v-for="(item,index) in list3" :key="index" class="clear">
                        <p class="left">{{item.thing}}</p>
                        <p class="right">{{item.remove_at}}</p>
                        <el-button class="right" size="small" type="danger" @click="to_delete(item,index)">删除</el-button>
                    </li>
                </ul>
                <p class="kong-tip" v-if="list3.length==0">暂无已取消事项</p>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    import {apigetThings, apiupdateThing, apideleteThing} from '../api/api'

    export default {
        name: "todolist",
        data() {
            return {
                list1: [],
                list2: [],
                list3: [],
                activeNames: ['1', '2', '3'],
            }
        },
        mounted() {
            //获取数据
            this.getList();
        },
        methods: {
            getList() {
                apigetThings({'userid': this.$store.state.userid}).then(res => {
                    this.list1 = res.list1;
                    this.list2 = res.list2;
                    this.list3 = res.list3;
                })
            },
            handleChange(val) {
                console.log(val);
            },
            to_done(item, index) {
                this.$confirm( '确定要将此事件转态改为已完成？更改后不可撤回', '是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    apiupdateThing({userid: item.userid, status: 2,create_at:item.create_at,thing:item.thing}).then(res => {
                        if (res.code == 0) {
                            this.list1.splice(index, 1);
                            item.done_at = res.update_at;
                            this.list2.unshift(item);
                            this.$message({
                                type: 'success',
                                message: '操作成功!'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            to_remove(item, index) {
                this.$confirm( '确定要将此事件转态改为已取消？更改后不可撤回', '是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    apiupdateThing({userid: item.userid, status: 3,create_at:item.create_at,thing:item.thing}).then(res => {
                        if (res.code == 0) {
                            if (item.status == 1) {
                                this.list1.splice(index, 1);
                            } else if (item.status == 2) {
                                this.list2.splice(index, 1);
                            }
                            item.remove_at = res.update_at;
                            this.list3.unshift(item);
                            this.$message({
                                type: 'success',
                                message: '操作成功!'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            to_delete(item, index) {
                this.$confirm( '确定要移除此事件?移除后不可恢复', '是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    apideleteThing({userid: item.userid, id: item.id}).then(res => {
                        if (res.code == 0) {
                            this.list3.splice(index, 1);
                            this.$message({
                                type: 'success',
                                message: '移除成功!'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            }
        },
        computed: {
            addThing(){return this.$store.state.addThing}
        },
        watch:{
            addThing(data){
                console.log(data)
                this.list1.unshift(data);
            }
        }
    }
</script>

<style scoped lang="scss">
    .todolist {
        .kong-tip {
            line-height: 80px;
            height: 80px;
            text-align: center;
            font-size: 20px;
            font-weight: bolder;
        }
        li{
            padding: 5px 10px;
            p{
                line-height: 32px;
                height: 32px;
            }
        }
        /deep/ .el-collapse-item__wrap{
            button{
                margin: 0 10px;
            }
        }

    }
</style>
