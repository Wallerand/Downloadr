<template>
  <div id="app">
    <Nav active="history"></Nav>
    <main>
      <div class="text-right">
        <button
          type="button"
          class="btn btn-outline-danger"
          v-show="history.length > 0"
          @click="clearHistory"
        >Clear history</button>
      </div>

      <ul id="queue" v-show="history.length > 0">
        <li v-for="(item, index) in history" :key="index">
          <div class="thumbnail" :style="'background-image: url('+ item.thumbnails[0].url +');'">
            <div class="delete" :ref="'delete-'+item.id" @click="removeFromHistory(item)">
              <Trash2Icon></Trash2Icon>
            </div>
          </div>
          <div class="info">
            <div class="title">
              <input
                :ref="'title-'+item.id"
                type="text"
                :value="item.title"
                @keyup="editTitle(item)"
              >
            </div>
            <span class="metadata uploader" v-if="item.uploader !== undefined">
              <UserIcon height="18" width="18"></UserIcon>
              {{ item.uploader }}
            </span>
            <span class="metadata duration" v-if="item._duration_raw !== undefined">
              <WatchIcon height="18" width="18"></WatchIcon>
              {{ parseDuration(item._duration_raw) }}
            </span>
            <span class="metadata extractor">
              <GlobeIcon height="18" width="18"></GlobeIcon>
              {{ item.extractor_key }}
            </span>
          </div>
        </li>
      </ul>

      <div id="empty-history" v-show="history.length <= 0">
        <h1>🧐</h1>
        <p>Nothing to show for now</p>
      </div>
    </main>
  </div>
</template>

<script>
import Nav from "./../Nav";
import moment from "moment";
import { mapState } from "vuex";

import {
  LinkIcon,
  UserIcon,
  WatchIcon,
  Trash2Icon,
  GlobeIcon
} from "vue-feather-icons";

export default {
  name: "history-page",
  components: { Nav, LinkIcon, UserIcon, WatchIcon, Trash2Icon, GlobeIcon },
  computed: {
    ...mapState({
      history: state => state.download.history
    })
  },
  methods: {
    clearHistory() {
      this.$store.dispatch("download/clearHistory");
    },
    removeFromHistory(item) {
      this.$store.dispatch("download/removeFromHistory", { id: item.id });
    },
    parseDuration(duration) {
      if (duration > 3600) {
        return moment.utc(duration * 1000).format("HH:mm:ss");
      } else {
        return moment.utc(duration * 1000).format("mm:ss");
      }
      return parsed;
    }
  }
};
</script>

<style lang="scss">
#empty-history {
  text-align: center;
  margin-top: 143px;
  h1 {
    font-size: 64px;
    margin-bottom: 0;
  }
  p {
    font-weight: bold;
    font-family: "Helvetica Neue", sans-serif;
    font-size: 26px;
    opacity: 0.3;
  }
}

ul#queue {
  margin-top: 30px;
  margin-bottom: 0;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(179, 196, 206, 0.19);
  border-radius: 6px;
  list-style: none;

  padding: 10px 0;

  li {
    display: block;
    position: relative;
    height: 82px;
    .thumbnail {
      width: 60px;
      height: 60px;
      background-position: center;
      background-color: #585858;
      background-size: cover;
      border-radius: 50%;
      position: absolute;
      top: 10px;
      left: 20px;
      box-shadow: rgba(60, 60, 60, 0.048) 0 3px 10px;
      .delete {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        color: #fff;
        text-align: center;
        line-height: 55px;
        cursor: pointer;
        display: none;
      }
    }
    div.info {
      position: absolute;
      top: 10px;
      left: 100px;
      right: 0;
      bottom: 0;
      border-bottom: 1px solid #f6f5f8;
      .title {
        input {
          border: none;
          outline: none;
          height: 33px;
          width: 100%;
          font-size: 20px;
          margin-right: 55px;
        }
      }
      .metadata {
        margin-right: 10px;
        opacity: 0.5;
        svg {
          vertical-align: sub;
        }
      }
    }
  }

  li:hover .thumbnail .delete {
    display: block;
  }

  li:last-child {
    div.info {
      border-bottom: none;
    }
  }
}
</style>
