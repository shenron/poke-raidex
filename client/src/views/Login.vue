<template>
  <v-row align="center">
    <v-col>
      <v-row justify="space-around">
        <h1>Login</h1>
      </v-row>
      <v-row justify="space-around">
        <LoginForm/>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
// @flow

import { Component, Vue } from 'vue-property-decorator';
import LoginForm from '@/components/LoginForm.vue';

export default
@Component({
  components: {
    LoginForm,
  },
})
class Login extends Vue {

}
</script>
