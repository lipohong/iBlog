<template>
  <v-app>
    <v-container>
      <v-btn color="primary">Hello World {{ $t(`welcome`) }}</v-btn>
    </v-container>
  </v-app>
</template>
<script>
  export default {
    middleware: 'checkTheme'
  }
</script>