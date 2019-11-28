<template>
  <div id="app" v-loading="loading">
    <router-view/>
    <sidebar></sidebar>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data(){
      return{
        loading: false
      }
    },
    methods:{

    },
    computed: {
      loadingStatus () {
        return this.$store.state.loading;
      }
    },
    watch: {
      loadingStatus (val) {
        this.loading = val;
      }
    }
  }
</script>
<style lang="scss">
  @import "./../public/style/common.scss";
  #app{
    width: 100%;
    min-width: 1340px;
    margin: 0 auto;
    height: 100%;
    background: #ffffff;
    /deep/ .van-loading{
      text-align: center;
      .van-loading__spinner{
        margin-top: 400px;
      }
    }

  }
</style>
