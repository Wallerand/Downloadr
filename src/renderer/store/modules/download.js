import { map } from "lodash";
import moment from "moment";
import ytdl from "../../utils/ytdl.js";

const state = {
  queue: [],
  downloading: [],
  history: []
};

const getters = {
  getItemFromQueueById: state => id => {
    return state.queue.find(item => item.id === id);
  },
  getIndexFromQueueById: state => id => {
    return state.queue.findIndex(item => item.id === id);
  },
  getItemsToDownload: state => {
    return state.history.filter(item => {
      return item.is_processed === false;
    });
  }
};

const mutations = {
  addToQueue(state, data) {
    if (Array.isArray(data)) {
      data.forEach(function(item) {
        state.queue.push(item);
      });
    } else {
      state.queue.push(data);
    }
  },
  removeFromQueue(state, id) {
    let index = this.getters["download/getIndexFromQueueById"](id);
    state.queue.splice(index, 1);
  },
  removeFromHistory(state, id) {
    let index = state.history.findIndex(item => item.id === id);
    state.history.splice(index, 1);
  },
  clearQueue(state) {
    state.queue = [];
  },
  addProperty(state, { id, key, status }) {
    let index = this.getters["download/getIndexFromQueueById"](id);
    let item = state.queue[index];
    item[key] = status;
    state.queue.splice(index, 1, item);
  },
  editProperty(state, { id, key, value }) {
    let index = this.getters["download/getIndexFromQueueById"](id);
    let item = state.queue[index];
    item[key] = value;
  },
  addToHistory(state, item) {
    state.history.push(item);
  },
  clearHistory(state) {
    state.history = [];
  }
};

const actions = {
  addToQueue({ commit }, { url }) {
    return new Promise((resolve, reject) => {
      ytdl
        .getInfo(url)
        .then(response => {
          if (
            this.getters["download/getItemFromQueueById"](response.id) ===
            undefined
          ) {
            commit("addToQueue", response);
            resolve(response);
          } else {
            reject({
              message: "This resource is already in queue.",
              error: null
            });
          }
        })
        .catch(error => {
          reject({
            message:
              "Unable to retrieve the resource, please check if the link is correct.",
            error: error
          });
        });
    });
  },
  removeFromQueue({ commit }, { id }) {
    commit("removeFromQueue", id);
  },
  clearQueue({ commit }) {
    commit("clearQueue");
  },
  removeFromHistory({ commit }, { id }) {
    commit("removeFromHistory", id);
  },
  clearHistory({ commit }) {
    commit("clearHistory");
  },
  editTitle({ commit }, { id, title }) {
    commit("editProperty", {
      id: id,
      key: "title",
      value: title
    });
  },
  processQueue({ commit, state }, config) {
    console.log("[download] Process queue requested");
    var queue = state.queue;

    console.log("[download] Start pre-processing tasks");
    queue.map(item => {
      console.log("[download][" + item.id + "] " + item.title);
      console.log("[download][" + item.id + "] Add metadata");
      commit("addProperty", {
        id: item.id,
        key: "is_processed",
        status: false
      });
      commit("addProperty", {
        id: item.id,
        key: "processed_ts",
        status: moment().unix()
      });

      console.log("[download][" + item.id + "] Add to history");
      commit("addToHistory", item);
    });

    var itemsToDownload = this.getters["download/getItemsToDownload"];

    if (itemsToDownload.length > 0) {
      console.log(
        "[download] " +
          itemsToDownload.length +
          "items to process, start processing tasks"
      );

      (async function loop() {
        for (const item of itemsToDownload) {
          console.log("[download][" + item.id + "] Process " + item.title);
          commit("addProperty", {
            id: item.id,
            key: "is_processing",
            status: true
          });
          try {
            let response = await ytdl.download(item, config);
            console.log(item.title + " processed!");
            console.log(response);
            commit("addProperty", {
              id: item.id,
              key: "is_processing",
              status: false
            });

            commit("addProperty", {
              id: item.id,
              key: "is_downloaded",
              status: true
            });
            commit("addProperty", {
              id: item.id,
              key: "is_processed",
              status: true
            });
            commit("removeFromQueue", item.id);
          } catch (err) {
            console.log("download failed", err);
            commit("addProperty", {
              id: item.id,
              key: "is_downloaded",
              status: false
            });
            commit("addProperty", {
              id: item.id,
              key: "is_processed",
              status: true
            });
          }
        }
      })(itemsToDownload);
    } else {
      console.log(
        "[download] " + itemsToDownload.length + "item to process, skip"
      );
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
