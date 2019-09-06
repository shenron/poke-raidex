<template>
  <v-form
    ref="form"
    v-model="valid"
  >
    <v-text-field
      v-model="user"
      :rules="userRules"
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
      @click="$store.dispatch('user/login', { user, password })"
    >
      Validate
    </v-btn>

  </v-form>
</template>

<script>
// @flow

import { Component, Vue } from 'vue-property-decorator';

export default
@Component
class LoginForm extends Vue {
  valid: boolean = true;

  user: ?string = null;

  password: ?string = null;

  userRules: Array<(string) => ?(string | boolean)> = [
    v => !!v || 'Le pseudo est obligatoire!',
  ];

  passwordRules: Array<(string) => ?(string | boolean)> = [
    v => !!v || 'Le mot de passe est obligatoire!',
  ];
}
</script>
