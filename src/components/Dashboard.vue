<template>
  <v-app id="keep">
    <navigation></navigation>
    <v-content>
      <v-container>
          <h1 class="display-2">Admin <span class="font-weight-light">Dashboard</span></h1>
          <v-divider></v-divider>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import Navigation from './Navigation.vue'

  export default {
    components: {
      'navigation': Navigation,
    },
  }
</script>