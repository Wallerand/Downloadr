<template>
  <div id="app">
    <Nav active="settings"></Nav>
    <main>
      <form>
        <div class="form-group">
          <label for="output_folder">Output folder</label>
          <div class="custom-file">
            <input
              type="file"
              name="path"
              webkitdirectory
              directory
              class="custom-file-input"
              @change="update"
            >
            <label
              class="custom-file-label"
              id="output_path"
              for="output_folder"
            >{{ (settings.path === null) ? 'Choose folder' : settings.path }}</label>
          </div>
        </div>

        <div class="form-group">
          <label for="download_type">Download type</label>
          <select class="custom-select" id="download_type" name="type" @change="update">
            <option
              v-for="(item, index) in settings.types"
              :key="index"
              :value="item.id"
              :selected="item.id == settings.type"
            >{{ item.name }}</option>
          </select>
        </div>

        <div class="row" v-show="settings.type == 2">
          <div class="col-4">
            <div class="form-group">
              <label for="audio_format">Audio format</label>
              <select class="custom-select" id="audio_format" name="audio_format" @change="update">
                <option
                  v-for="(format, index) in settings.audio_formats"
                  :key="index"
                  :value="format"
                  :selected="format == settings.audio_format"
                  @change="update"
                >{{ format }}</option>
              </select>
            </div>
          </div>

          <div class="col-8">
            <div class="form-group" v-show="settings.type == 2">
              <label for="audio_quality">Audio quality</label>
              <input
                type="range"
                name="audio_quality"
                class="custom-range"
                min="0"
                max="9"
                :value="settings.audio_quality"
                @change="update"
              >
              <small class="form-text text-muted">From best to worst</small>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="col-form-label">Library version</label>
          <div class="input-group">
            <input type="text" readonly class="form-control" :placeholder="settings.version">
            <div class="input-group-append">
              <button class="btn btn-primary" type="button" @click="updateLibrary">Update</button>
            </div>
          </div>
        </div>
      </form>
    </main>
  </div>
</template>

<script>
import Nav from "./../Nav";
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  name: "settings-page",
  components: { Nav },
  mounted() {
    this.$store.dispatch("settings/getVersion");
  },
  methods: {
    updateLibrary() {
      this.$store.dispatch("settings/updateVersion");
    },
    update(event) {
      this.$store.dispatch("settings/edit", {
        key: event.target.name,
        value:
          event.target.name === "path"
            ? event.target.files[0].path
            : event.target.value
      });
    }
  },
  computed: {
    ...mapState({
      settings: state => state.settings
    })
  }
};
</script>

<style>
</style>
