<template>
  <v-app-bar app color="indigo" dark>
    <v-toolbar-title>CECC Manager</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn :to="{ name: 'home' }">Home</v-btn>
    <v-btn :to="{ name: 'about' }">About</v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style lang="scss" scoped></style>
