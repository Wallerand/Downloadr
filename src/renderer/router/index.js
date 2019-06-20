import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: { name: "home" }
    },
    {
      path: "/app/home",
      name: "home",
      component: require("@/components/App/HomePage").default
    },
    {
      path: "/app/history",
      name: "history",
      component: require("@/components/App/HistoryPage").default
    },
    {
      path: "/app/settings",
      name: "settings",
      component: require("@/components/App/SettingsPage").default
    },

    {
      path: "*",
      redirect: { name: "home" }
    }
  ]
});
