<template>
    <el-drawer title="" :direction="direction" :visible.sync="drawer" :show-close="showClose" size="20%" @close="closeDrawer()">
        <ul>
            <li v-for="item in navList" :key="item.id" @click="changeNav(item)">
                <el-button :type="activeTheme.type?activeTheme.type:'primary'" plain v-if="activeNav != item.id">{{item.name}}</el-button>
                <el-button :type="activeTheme.type?activeTheme.type:'primary'" v-if="activeNav == item.id">{{item.name}}</el-button>
            </li>
            <el-drawer
                    title=""
                    :append-to-body="true"
                    :direction="direction"
                    :visible.sync="innerDrawer">
                <ul class="theme">
                    <li v-for="item in colorList" :key="item.color" @click="changeTheme(item)"><span :style="{ background: item.color}"></span><span>{{item.color}}</span></li>
                </ul>
            </el-drawer>
        </ul>
    </el-drawer>
</template>

<script>
    import VueCookies from 'vue-cookies'
    export default {
        name: "sidebar",
        data(){
            return{
                showClose:false,
                direction:'ltr',
                drawer: this.$store.state.shownav,
                innerDrawer: false,
                activeNav: this.$route.meta.id,
                activeTheme: this.$store.state.activeTheme,
                navList: [{name: 'home',id:1,to:'/home'},{name: 'todo-list',id:2,to:'/onelist?title=待做事项',status:1},{name: 'done-list',id:3,to:'/onelist?title=已完成事项',status:2},{name: 'delete-list',id:4,to:'/onelist?title=已取消事项',status:3},{name: 'theme',id:5},{name: '个人中心',id:6,to:'/my'},{name: '退出登录',id:7,to:'/login'}],
                colorList: [{color:'#409eff',type:'primary'},{color:'#67c23a',type:'success'},{color:'#909399',type:'info'},{color:'#e6a23c',type:'warning'},{color:'#f56c6c',type:'danger'}]
            }
        },
        mounted(){},
        methods:{
            changeNav(item){
                if(item.id == this.activeNav){return false}
                this.activeNav = item.id;
                if(item.id!=5&&item.id!=7){
                    this.$store.commit('ACTIVE_NAV',this.activeNav);
                }
                if(item.id == 5){
                    this.innerDrawer = true
                } else {
                    this.innerDrawer = false
                }
                if(item.id == 7){
                    VueCookies.remove('todoCode');
                    this.$store.commit('CHANGE_NAV',false);
                }
                if(item.to){
                    if(this.$route.path == item.to) {return false}
                    this.$router.push({path:item.to});
                }
            },
            changeTheme(item){
                this.activeTheme = item;
                this.$store.commit('ACTIVE_THEME',this.activeTheme);
            },
            closeDrawer(){
                this.$store.commit('CHANGE_NAV',false);
            }
        },
        computed:{
            newStatus(){return this.$store.state.shownav}
        },
        watch:{
            newStatus(val){
                this.drawer = val;
            }
        }
    }
</script>

<style scoped lang="scss">
    ul{
        padding-top: 100px;
        li{
            text-align: center;
            padding: 10px 0px;
            border-bottom: 1px solid #eeeeee;
            button{
                width: 100px;
            }
        }
    }
    .theme{
        li{
            span{
                height: 22px;
                line-height: 22px;
                vertical-align: top;
                margin-right: 5px;
            }
            span:first-child{
                width: 22px;
            }
        }
    }
</style>
