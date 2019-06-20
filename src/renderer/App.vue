<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Downloadr"
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");
@import url("https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
  background-color: #f3f5f9 !important;
}

main {
  position: absolute;
  left: 0;
  right: 0;
  top: 60px;
  bottom: 0;
  padding: 30px;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
