<template>
  <v-row align="center">
    <v-col>
      <v-row justify="space-around">
        <h1>Login</h1>
      </v-row>
      <v-row justify="space-around">
        <LoginForm @logged="$router.push({ name: 'home' })" />
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
  get user() {
    return this.$store.getters['user/user'];
  }

  beforeRouteEnter(to: Object, from: Object, next: Function) {
    next((vm: Vue) => {
      if (vm.user.id) {
        vm.$router.push({ name: 'home' });
      }
    });
  }
}
</script>
