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
  name: 'home'
}
</script>
<style lang="scss">
  .box{
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
  }
</style>
