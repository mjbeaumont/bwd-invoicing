<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-card width="400">
        <validation-observer v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(login)">
            <v-card-title>
              <h1>Login</h1>
            </v-card-title>
            <v-card-text>
              <validation-provider
                name="email"
                rules="required|email"
                v-slot="{ errors, valid }"
              >
                <v-text-field
                  label="Email"
                  prepend-icon="mdi-account-circle"
                  v-model="username"
                  :error-messages="errors"
                  :success="valid"
                ></v-text-field>
              </validation-provider>
              <validation-provider
                name="password"
                rules="required"
                v-slot="{ errors, valid }"
              >
                <v-text-field
                  label="Password"
                  :type="showPassword ? 'Text' : 'Password'"
                  prepend-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="togglePassword"
                  v-model="password"
                  :error-messages="errors"
                  :success="valid"
                ></v-text-field>
              </validation-provider>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn type="submit" color="success">Login</v-btn>
            </v-card-actions>
          </v-form>
        </validation-observer>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
export default {
  components: { ValidationProvider, ValidationObserver },
  data() {
    return {
      showPassword: false,
      username: "",
      password: ""
    };
  },
  methods: {
    login() {
      console.log("logged in!");
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    }
  },
  name: "Login"
};
</script>

<style scoped></style>
