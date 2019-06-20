import ytdl from "../../utils/ytdl.js";

const state = {
  path: null,
  type: 2,
  types: [{ id: 1, name: "Video + audio" }, { id: 2, name: "Audio only" }],
  audio_quality: 5,
  audio_format: "mp3",
  audio_formats: ["best", "aac", "flac", "mp3", "m4a", "vorbis", "opus", "wav"],
  version: {
    current: null,
    result: null
  }
};

const mutations = {
  change(state, { key, value }) {
    state[key] = value;
  }
};

const actions = {
  edit({ commit }, { key, value }) {
    commit("change", { key, value });
  },
  getVersion({ commit }) {
    ytdl.version(version => {
      commit("change", { key: "version", value: version });
    });
  },
  updateVersion({ commit, dispatch }) {
    ytdl.update(response => {
      commit("change", { key: "version", value: response });
      dispatch("getVersion");
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
