<template>
  <div class="home">
    <todoheader></todoheader>
    <div class="box">
      <eventadd></eventadd>
      <todolist></todolist>
    </div>
    <todofooter></todofooter>
  </div>
</template>

<script>

export default {
  name: 'home',
  mounted(){

  }
}
</script>
<style lang="scss" scoped>
  .box{
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
  }
</style>
