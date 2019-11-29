<template>
    <div class="todolist">
        <todoheader></todoheader>
        <div class="box">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column v-for="(item,index) in appTableConfigs" sortable :key="index" align="center" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
                <el-table-column align="center" fixed="right" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" v-if="status == 1" @click="to_update(scope.row,2)">完成</el-button>
                        <el-button type="text" size="small" v-if="status == 1 || status == 2" @click="to_update(scope.row,3)">取消</el-button>
                        <el-button type="text" size="small" v-if="status == 3" @click="to_delete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="bottom-box" style="text-align: center;margin: 10px">
                <el-pagination small background layout="prev, pager, next" :total="total"></el-pagination>
            </div>
        </div>
        <todofooter></todofooter>
    </div>
</template>

<script>
    import {apigetoneThings,apiupdateThing,apideleteThing} from '../api/api'
    export default {
        name: "todolist",
        data(){
            return {
                status: this.$store.state.activeNav - 1,
                total:0,
                tableData:[],
                appTableConfigs: [
                    { label: 'ID', prop: 'id', width: 100 },
                    { label: 'thing', prop: 'thing', width: 300 },
                    { label: 'time', prop: 'time', width: 200 }
                ]
            }
        },
        mounted(){
            this.initlist();
        },
        methods:{
            initlist() {
                apigetoneThings({status: this.status,userid: this.$store.state.userid,pageIndex: 1,pageCount: 10}).then( res => {
                    if (res.code == 0) {
                        this.total = res.total;
                        for(var i in res.list){
                            res.list[i].time = this.status == 1 ? res.list[i].create_at : this.status == 2 ? res.list[i].done_at : res.list[i].remove_at;
                        }
                        this.tableData = res.list;
                    }
                })
            },
            to_update(item,type) {
                this.$confirm( '确定要将此事件转态改为'+(type==2?'已完成？':'已取消?')+'更改后不可撤回', '是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    apiupdateThing({userid: item.userid, status: type,create_at:item.create_at,thing:item.thing}).then(res => {
                        if (res.code == 0) {
                            this.tableData.splice(this.tableData.indexOf(item), 1);
                            item.done_at = res.update_at;
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
            to_delete(item) {
                var self=this;
                self.$confirm( '确定要移除此事件?移除后不可恢复', '是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    apideleteThing({userid: item.userid, id: item.id}).then(res => {
                        if (res.code == 0) {
                            self.tableData.splice(self.tableData.indexOf(item), 1);
                            self.$message({
                                type: 'success',
                                message: '移除成功!'
                            });
                        }
                    })
                }).catch(() => {
                    self.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            }
        },
        computed: {
            thingType(){
                return this.$store.state.activeNav;
            }
        },
        watch: {
            thingType(val){
                this.status = val - 1;
                this.initlist();
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

</style>
