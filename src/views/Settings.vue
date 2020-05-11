<template>
  <v-row
    ><v-col cols="12">
      <v-expansion-panels multiple
        ><v-expansion-panel v-if="settings.clickup">
          <v-expansion-panel-header>Clickup Settings</v-expansion-panel-header>
          <v-expansion-panel-content
            ><v-row
              ><v-col cols="12"
                ><v-text-field
                  v-model="settings.clickup.auth_key"
                  label="Personal API Token"
                ></v-text-field
                ><v-text-field
                  v-model="settings.clickup.team_id"
                  label="Team ID"
                ></v-text-field> </v-col></v-row
          ></v-expansion-panel-content> </v-expansion-panel
        ><v-expansion-panel v-if="settings.freshbooks">
          <v-expansion-panel-header
            >Freshbooks Settings</v-expansion-panel-header
          >
          <v-expansion-panel-content
            ><v-row
              ><v-col cols="12"
                ><v-text-field
                  v-model="settings.freshbooks.access_token"
                  label="Access Token"
                ></v-text-field
                ><v-text-field
                  v-model="settings.freshbooks.client_id"
                  label="Client ID"
                ></v-text-field>
                <v-text-field
                  v-model="settings.freshbooks.client_secret"
                  label="Client Secret"
                ></v-text-field
                ><v-text-field
                  v-model="settings.freshbooks.refresh_token"
                  label="Refresh Token"
                ></v-text-field
                ><v-text-field
                  v-model="settings.freshbooks.expires"
                  label="Refresh Token Expiration"
                ></v-text-field
                ><v-text-field
                  v-model="settings.freshbooks.redirect_uri"
                  label="Redirect URI"
                ></v-text-field>
                <v-text-field
                  v-model="settings.freshbooks.account_id"
                  label="Account ID"
                ></v-text-field> </v-col></v-row
          ></v-expansion-panel-content> </v-expansion-panel
        ><v-expansion-panel v-if="settings.projects">
          <v-expansion-panel-header>Project Defaults</v-expansion-panel-header>
          <v-expansion-panel-content
            ><v-row
              v-for="(project, index) in settings.projects"
              :key="project.name"
              ><v-col cols="4"
                ><v-autocomplete
                  v-model="project.name"
                  :items="projects"
                  label="Project Name"
                  placeholder="Start typing to search"
                  prepend-icon="mdi-magnify"
                ></v-autocomplete> </v-col
              ><v-col cols="4">
                <v-autocomplete
                  v-model="project.client_id"
                  :items="clients"
                  item-text="organization"
                  item-value="id"
                  label="Client"
                  placeholder="Start typing to search"
                  prepend-icon="mdi-magnify"
                ></v-autocomplete> </v-col
              ><v-col cols="3">
                <v-checkbox
                  v-model="project.includeProjects"
                  label="Include project name in description"
                ></v-checkbox> </v-col
              ><v-col cols="1">
                <v-btn icon @click="remove(index)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </v-col>
              <v-col cols="12"><v-divider></v-divider></v-col
            ></v-row>
            <v-row
              ><v-btn class="secondary" @click="add"
                ><v-icon>mdi-plus</v-icon>Add</v-btn
              ></v-row
            >
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-btn color="primary" @click="save()" class="mt-3 ml-3"
        ><v-icon>mdi-content-save</v-icon>Save</v-btn
      ><v-btn color="secondary" @click="reset()" class="mt-3 ml-3"
        ><v-icon>mdi-lock-reset</v-icon>Reset</v-btn
      ></v-col
    ></v-row
  ></template
>
<script>
import { dispatch } from "vuex-pathify";
import { clone } from "../utils/functions";
import clickupService from "../utils/clickup-service";
export default {
  computed: {
    clients() {
      return this.$store.get("client/clients").map(client => {
        return {
          id: client.id,
          organization: client.organization
        };
      });
    },
    projects() {
      return this.folders.map(folder => folder.name);
    }
  },
  data() {
    return {
      settings: {},
      folders: []
    };
  },
  async created() {
    await this.setLocalSettings();
    this.$store.subscribe(mutation => {
      if (mutation.type === "setting/SET_SETTINGS") {
        this.setLocalSettings();
      }
    });
  },
  methods: {
    add() {
      this.settings.projects.push({
        client_id: 0,
        includeProjects: false,
        name: ""
      });
    },
    async setLocalSettings() {
      this.settings = clone(this.$store.get("setting/settings"));
      if (this.settings.clickup) {
        let response = await clickupService.getFolders({
          archived: false
        });
        this.folders = response.folders;
      }
    },
    reset() {
      this.setLocalSettings();
    },
    remove(index) {
      this.settings.projects.splice(index, 1);
    },
    save() {
      dispatch("setting/updateSettings", {
        val: this.settings,
        mergeType: "overwrite"
      });
      this.$store.set("snack/snack", {
        snackbar: true,
        text: "Settings saved successfully",
        timeout: 6000,
        color: "success",
        bottom: true
      });
    }
  },
  name: "Settings"
};
</script>

<style scoped></style>
