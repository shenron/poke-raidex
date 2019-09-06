<template>
  <v-form
    ref="form"
    v-model="valid"
  >
    <v-text-field
      v-model="name"
      :rules="nameRules"
      label="Nom"
      required
    ></v-text-field>

    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="Mot de passe"
      type="password"
      required
    ></v-text-field>

    <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="login"
    >
      Validate
    </v-btn>

  </v-form>
</template>

<script>
// @flow

import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';

export default
@Component
class LoginForm extends Vue {
  valid: boolean = true;

  name: ?string = null;

  password: ?string = null;

  nameRules: Array<(string) => ?(string | boolean)> = [
    v => !!v || 'Le pseudo est obligatoire!',
  ];

  passwordRules: Array<(string) => ?(string | boolean)> = [
    v => !!v || 'Le mot de passe est obligatoire!',
  ];

  async login() {
    const { data } = await axios.get('/api/auth');
    if (data === 'ok') {
      this.$router.push({ name: 'home' });
    }
  }
}
</script>
