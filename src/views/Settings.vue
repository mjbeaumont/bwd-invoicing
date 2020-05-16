<template>
  <v-row
    ><v-col cols="12">
      <v-expansion-panels multiple
        ><v-expansion-panel>
          <v-expansion-panel-header>Clickup Settings</v-expansion-panel-header>
          <v-expansion-panel-content
            ><v-row
              ><v-col cols="12"
                ><v-text-field
                  v-model="auth_key"
                  label="Personal API Token"
                ></v-text-field
                ><v-text-field v-model="team_id" label="Team ID"></v-text-field>
                <v-text-field
                  v-model="space_id"
                  label="Space ID"
                ></v-text-field> </v-col></v-row
          ></v-expansion-panel-content> </v-expansion-panel
        ><v-expansion-panel>
          <v-expansion-panel-header
            >Freshbooks Settings</v-expansion-panel-header
          >
          <v-expansion-panel-content
            ><v-row
              ><v-col cols="12"
                ><v-text-field
                  v-model="access_token"
                  label="Access Token"
                ></v-text-field
                ><v-text-field
                  v-model="client_id"
                  label="Client ID"
                ></v-text-field>
                <v-text-field
                  v-model="client_secret"
                  label="Client Secret"
                ></v-text-field
                ><v-text-field
                  v-model="refresh_token"
                  label="Refresh Token"
                ></v-text-field
                ><v-text-field
                  v-model="expires"
                  label="Refresh Token Expiration"
                ></v-text-field
                ><v-text-field
                  v-model="redirect_uri"
                  label="Redirect URI"
                ></v-text-field>
                <v-text-field
                  v-model="account_id"
                  label="Account ID"
                ></v-text-field> </v-col></v-row
          ></v-expansion-panel-content> </v-expansion-panel
        ><v-expansion-panel>
          <v-expansion-panel-header>Project Defaults</v-expansion-panel-header>
          <v-expansion-panel-content
            ><v-row
              v-for="(project, index) in projectSettings"
              :key="project.name"
              ><v-col cols="5"
                ><v-autocomplete
                  :value="project.name"
                  @input="v => updateProject(v, index, 'name')"
                  :items="projects"
                  label="Project Name"
                  placeholder="Start typing to search"
                  prepend-icon="mdi-magnify"
                ></v-autocomplete> </v-col
              ><v-col cols="5">
                <v-autocomplete
                  :value="project.client_id"
                  @input="v => updateProject(v, index, 'client_id')"
                  :items="clients"
                  item-text="organization"
                  item-value="id"
                  label="Client"
                  placeholder="Start typing to search"
                  prepend-icon="mdi-magnify"
                ></v-autocomplete> </v-col
              ><v-col cols="1">
                <v-btn icon @click="removeProject(index)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </v-col>
              <v-col cols="12"><v-divider></v-divider></v-col
            ></v-row>
            <v-row
              ><v-btn class="secondary" @click="addProject"
                ><v-icon>mdi-plus</v-icon>Add</v-btn
              ></v-row
            >
          </v-expansion-panel-content> </v-expansion-panel
        ><v-expansion-panel>
          <v-expansion-panel-header>Client Defaults</v-expansion-panel-header>
          <v-expansion-panel-content
            ><v-row
              v-for="(client, index) in clientSettings"
              :key="client.client_id"
              ><v-col cols="4">
                <v-autocomplete
                  :value="client.client_id"
                  @input="v => updateClient(v, index, 'client_id')"
                  :items="clients"
                  item-text="organization"
                  item-value="id"
                  label="Client"
                  placeholder="Start typing to search"
                  prepend-icon="mdi-magnify"
                ></v-autocomplete> </v-col
              ><v-col cols="3">
                <v-checkbox
                  :input-value="client.includeProjects"
                  @change="v => updateClient(v, index, 'includeProjects')"
                  label="Include project name in description"
                ></v-checkbox> </v-col
              ><v-col cols="1">
                <v-btn icon @click="removeClient(index)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </v-col>
              <v-col cols="12"><v-divider></v-divider></v-col
            ></v-row>
            <v-row
              ><v-btn class="secondary" @click="addClient"
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
import { commit, dispatch, sync, get } from "vuex-pathify";
import { ProjectSetting, ClientSetting } from "../utils/classes";
export default {
  computed: {
    ...sync("setting/clickup@*"),
    ...sync("setting/freshbooks@*"),
    projectSettings: get("setting/projects"),
    clientSettings: get("setting/clients"),
    folders: get("setting/folders"),
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
  methods: {
    addProject() {
      commit("setting/ADD_PROJECT", new ProjectSetting({}));
    },
    removeProject(index) {
      commit("setting/REMOVE_PROJECT", index);
    },
    updateProject(value, index, property) {
      const path = "setting/projects@[" + index + "]." + property;
      this.$store.set(path, value);
    },
    addClient() {
      commit("setting/ADD_CLIENT", new ClientSetting({}));
    },
    removeClient(index) {
      commit("setting/REMOVE_CLIENT", index);
    },
    updateClient(value, index, property) {
      const path = "setting/clients@[" + index + "]." + property;
      this.$store.set(path, value);
    },
    reset() {
      dispatch("setting/loadSettings");
      this.$store.set("snack/snack", {
        snackbar: true,
        text: "Settings reset successfully",
        timeout: 6000,
        color: "success",
        bottom: true
      });
    },
    save() {
      dispatch("setting/saveSettings");
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
