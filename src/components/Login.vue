<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-card width="400">
        <v-card-title class="pb-0">
          <h1>Login</h1>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              label="Email"
              prepend-icon="mdi-account-circle"
            ></v-text-field>
            <v-text-field
              label="Password"
              :type="showPassword ? 'Text' : 'Password'"
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="togglePassword"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="success">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      showPassword: false
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    }
  },
  name: "Login"
};
</script>

<style scoped></style>
