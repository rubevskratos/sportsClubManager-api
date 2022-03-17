<template>
  <v-card dark>
    <v-card-title>Accede</v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field v-model="email" label="Input your email"></v-text-field>
        <v-text-field
          v-model="password"
          label="Input your email"
        ></v-text-field>
      </v-form>
      <v-card-actions>
        <v-btn @click="login">Login</v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script>
import authService from "@/services/authService";

export default {
  name: "LoginForm",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      const data = await authService.login(this.email, this.password);
      this.response = data;
      window.localStorage.token = this.response.token;
    },
  },
};
</script>

<style lang="scss" scoped></style>
