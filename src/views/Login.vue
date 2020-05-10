<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-card width="400">
        <validation-observer v-slot="{ handleSubmit }" ref="form">
          <v-form @submit.prevent="handleSubmit(login)">
            <v-card-title>
              <h1>Login</h1>
            </v-card-title>
            <v-card-text>
              <validation-provider
                name="email"
                rules="required|email"
                v-slot="{ errors }"
              >
                <v-text-field
                  label="Email"
                  prepend-icon="mdi-account-circle"
                  v-model="username"
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
              <validation-provider
                name="password"
                rules="required"
                v-slot="{ errors }"
              >
                <v-text-field
                  label="Password"
                  :type="showPassword ? 'Text' : 'Password'"
                  prepend-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="togglePassword"
                  v-model="password"
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn type="submit" color="info" right>Login</v-btn>
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
    async login() {
      let response = await this.$store.dispatch("user/login", {
        username: this.username,
        password: this.password
      });
      if (response.success) {
        await this.$router.push("dashboard");
      } else {
        this.$refs.form.setErrors({
          password: response.msg
        });
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    }
  },
  name: "Login"
};
</script>

<style scoped></style>
