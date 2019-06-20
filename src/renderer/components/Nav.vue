<template>
  <nav>
    <h1 class="page-title">Downloadr</h1>
    <ul>
      <router-link to="/app/home">
        <li :class="[active == 'download' ? 'icon-active' : '']">
          <DownloadCloudIcon></DownloadCloudIcon>
        </li>
      </router-link>
      <router-link to="/app/history">
        <li :class="[active == 'history' ? 'icon-active' : '']">
          <ClockIcon></ClockIcon>
        </li>
      </router-link>
      <router-link to="/app/settings">
        <li :class="[active == 'settings' ? 'icon-active' : '']">
          <SlidersIcon></SlidersIcon>
        </li>
      </router-link>
    </ul>
  </nav>
</template>

<script>
import { DownloadCloudIcon, ClockIcon, SlidersIcon } from "vue-feather-icons";
export default {
  props: ["active"],
  components: { DownloadCloudIcon, ClockIcon, SlidersIcon }
};
</script>

<style lang="scss">
$nav-height: 60px;
$nav-theme-color: #545454;

nav {
  z-index: 100;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;
  height: $nav-height;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  background-color: #fff;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);

  color: $nav-theme-color;

  a.router-link,
  a.router-link-active,
  a li {
    color: $nav-theme-color;
    -webkit-app-region: no-drag;
  }

  h1.page-title {
    font-size: 18px;
    font-family: "Helvetica Neue", sans-serif;
    font-weight: bold;
    text-align: center;
    line-height: $nav-height;
    text-transform: capitalize;
  }

  h1.page-title {
    cursor: default;
  }

  ul {
    position: absolute;
    right: 0;
    top: 0;
    height: $nav-height;
    line-height: $nav-height - 5px;
    padding-right: 25px;

    li {
      display: inline;
      text-align: center;
      margin-left: 20px;
      opacity: 1;
      transition: 0.3s;
    }

    li:hover,
    li.icon-active {
      opacity: 0.25;
    }
  }
}
</style>
