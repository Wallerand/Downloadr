<template>
  <div id="app">
    <Nav active="download"></Nav>
    <main>
      <div id="link-add">
        <div class="input">
          <span class="link-icon">
            <LinkIcon height="22" width="20"></LinkIcon>
          </span>
          <span class="actions">
            <button
              class="btn btn-sm btn-success"
              type="button"
              :disabled="disabled.addToQueue"
              @click="addToQueue"
            >{{ disabled.addToQueue ? 'Loading...' : 'Add to queue' }}</button>
            <button
              type="button"
              class="btn btn-sm btn-primary"
              :disabled="disabled.addToQueue"
              @click="processQueue"
              v-show="queue.length > 0"
            >Download all</button>
          </span>
          <input
            type="url"
            placeholder="Enter a link..."
            v-model="url"
            @keyup.enter="addToQueue"
            @focus="paste"
          >
        </div>
      </div>

      <div id="link-add-error" class="alert alert-danger" v-show="errors.queue.status">
        <p class="mb-0 text-center">{{ errors.queue.message }}</p>
      </div>

      <ul id="queue" v-show="queue.length > 0">
        <li
          v-for="(item, index) in queue"
          :key="index"
          :class="[item.is_processing ? 'processing' : '']"
        >
          <div class="thumbnail" :style="'background-image: url('+ item.thumbnails[0].url +');'">
            <div
              class="delete"
              :ref="'delete-'+item.id"
              @click="(!item.is_processing) ? removeFromQueue(item) : null"
            >
              <Trash2Icon></Trash2Icon>
            </div>
            <div class="downloading" :ref="'delete-'+item.id">
              <DownloadCloudIcon></DownloadCloudIcon>
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

      <div id="empty-queue" v-show="queue.length <= 0">
        <h1>🤭</h1>
        <p>Add link to queue to get started</p>
      </div>
    </main>
  </div>
</template>

<script>
import moment from "moment";
import Nav from "./../Nav";
import { mapState } from "vuex";
import {
  LinkIcon,
  UserIcon,
  WatchIcon,
  Trash2Icon,
  GlobeIcon,
  DownloadCloudIcon
} from "vue-feather-icons";
export default {
  data() {
    return {
      url: null,
      disabled: {
        addToQueue: false
      },
      errors: {
        queue: {
          status: false,
          message: null
        }
      }
    };
  },
  name: "home-page",
  components: {
    Nav,
    LinkIcon,
    UserIcon,
    WatchIcon,
    Trash2Icon,
    GlobeIcon,
    DownloadCloudIcon
  },
  methods: {
    parseDuration(duration) {
      if (duration > 3600) {
        return moment.utc(duration * 1000).format("HH:mm:ss");
      } else {
        return moment.utc(duration * 1000).format("mm:ss");
      }
      return parsed;
    },
    addToQueue() {
      this.errors.queue.status = false;
      if (!this.disabled.addToQueue) {
        this.disabled.addToQueue = true;
        this.$store
          .dispatch("download/addToQueue", { url: this.url })
          .then(item => {
            this.url = null;
            this.disabled.addToQueue = false;
          })
          .catch(error => {
            this.disabled.addToQueue = false;
            this.errors.queue.status = true;
            this.errors.queue.message = error.message;
            console.error("[error][messsage] " + error.message);
            console.error("[error][detail] " + error.error);
          });
      }
    },
    removeFromQueue(item) {
      this.$store.dispatch("download/removeFromQueue", { id: item.id });
    },
    clearQueue() {
      this.$store.dispatch("download/clearQueue");
    },
    processQueue() {
      this.$store.dispatch("download/processQueue", this.settings);
    },
    paste() {
      this.url = this.$electron.clipboard.readText();
      this.addToQueue();
    },
    editTitle(item) {
      var title = this.$refs["title-" + item.id][0].value;
      this.$store.dispatch("download/editTitle", {
        id: item.id,
        title: title
      });
    }
  },
  computed: {
    ...mapState({
      queue: state => state.download.queue,
      history: state => state.download.history,
      settings: state => state.settings
    })
  }
};
</script>

<style lang="scss">
#empty-queue {
  text-align: center;
  margin-top: 100px;
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

#link-add {
  position: relative;
  height: 44px;
  input {
    position: absolute;
    width: 100%;
    padding: 10px 108px 10px 42px;
    border-radius: 6px;
    border: none;
    z-index: 1;
    outline: none;
    box-shadow: 0 0 10px rgba(179, 196, 206, 0.19);
  }

  input:focus {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  span.link-icon {
    position: absolute;
    z-index: 10;
    top: 8px;
    left: 12px;
    color: #efefef;
  }

  span.actions {
    position: absolute;
    z-index: 10;
    right: 7px;
    top: 7px;

    button {
      border-radius: 4px;
      border-color: transparent;
    }
  }
}

#link-add-error {
  border-top-left-radius: unset;
  border-top-right-radius: unset;
  width: 96%;
  margin-left: 2%;
  border: none;
  box-shadow: 0 0 10px rgba(179, 196, 206, 0.19);
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

  li .downloading {
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

  li.processing {
    cursor: wait;
    .downloading {
      display: block;
      cursor: wait;
    }
  }

  li:hover .thumbnail .delete {
    display: block;
  }

  li.processing:hover .thumbnail .delete {
    display: none;
  }

  li:last-child {
    div.info {
      border-bottom: none;
    }
  }
}
</style>
