<template>
  <v-card max-width="344" class="mx-auto">
    <v-card-title>
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-badge>
            <span>A partir du 10 Septembre</span>
            <template v-slot:badge
              ><span v-on="on">42</span></template
            >
          </v-badge>
        </template>
        <span>42 Participants</span>
      </v-tooltip>
    </v-card-title>

    <v-card-text>
      <v-select
        v-model="teamId"
        :items="teams"
        item-text="label"
        item-value="id"
        label="Chez les"
      >
        <v-icon slot="prepend" :color="color">mdi-account</v-icon>
      </v-select>

      <v-select
        v-model="accountIds"
        :items="accountList"
        item-value="id"
        item-text="label"
        label="Comptes"
        multiple
        chips
        hint="Mes petits comptes"
        persistent-hint
        ref="accountsSelect"
      >
        <template v-slot:append-item>
          <v-layout row>
            <v-divider class="mb-2"></v-divider>
            <v-list-item>
              <v-list-item-content>
                <form>
                  <v-btn
                    icon
                    @click="isExtandedMenuDisplayed = !isExtandedMenuDisplayed"
                    class="ml-1 mr-1"
                  >
                    <v-icon>{{
                      isExtandedMenuDisplayed
                        ? 'mdi-chevron-up'
                        : 'mdi-chevron-down'
                    }}</v-icon>
                  </v-btn>

                  <v-expand-transition>
                    <div v-show="isExtandedMenuDisplayed">
                      <v-text-field v-model="newAccount" label="Nouveau compte">
                        <v-btn slot="append" small @click="applyNewCompte"
                          ><v-icon>mdi-plus</v-icon></v-btn
                        >
                      </v-text-field>
                      <v-text-field
                        v-model="accountToRemove"
                        label="Suppression compte"
                      >
                        <v-btn slot="append" small @click="removeAccount">
                          <v-icon>mdi-minus</v-icon>
                        </v-btn>
                      </v-text-field>
                    </div>
                  </v-expand-transition>

                  <v-btn
                    v-if="$refs.accountsSelect"
                    @click="onCloseManageAccount"
                  >
                    OK <v-icon dark right>mdi-check</v-icon>
                  </v-btn>
                </form>
              </v-list-item-content>
            </v-list-item>
          </v-layout>
        </template>
      </v-select>
    </v-card-text>

    <v-card-actions>
      <v-dialog v-model="savedModal" persistent max-width="290">
        <template v-slot:activator="{ on }">
          <v-btn v-if="isAvailable" v-on="on" class="ma-2" color="green" dark>
            <v-icon dark>mdi-checkbox-marked-circle</v-icon>
          </v-btn>

          <v-btn v-else class="m-2" v-on="on" color="orange">
            <v-icon dark>mdi-wrench</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">C'est dans la boite!</v-card-title>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="green darken-1" text @click="savedModal = false"
              >OK</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-if="!isAvailable"
        v-model="leaveDialog"
        persistent
        max-width="290"
      >
        <template v-slot:activator="{ on }">
          <v-btn class="ma-2" dark v-on="on" color="red">
            <v-icon dark>mdi-cancel</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">Quitter le Raid ex?</v-card-title>
          <v-card-text>Vous pouvez à tout moment le rejoindre ;)</v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="green darken-1" text @click="leaveDialog = false"
              >Oui</v-btn
            >
            <v-btn color="green darken-1" text @click="leaveDialog = false"
              >Non</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script>
// @flow
import { Component, Prop, Vue } from 'vue-property-decorator';

export default
@Component
class RaidEx extends Vue {
  leaveDialog: boolean = false;

  savedModal: boolean = false;

  teamId: number = 1;

  accountIds: Array<number> = [1, 3];

  newAccount: string = '';

  accountToRemove: string = '';

  isExtandedMenuDisplayed: boolean = false;

  get color() {
    let color = '';
    switch (this.teamId) {
      case 1: {
        color = 'red';
        break;
      }
      case 2: {
        color = 'blue';
        break;
      }
      case 3: {
        color = 'yellow';
        break;
      }
      default: {
        color = '';
      }
    }
    return color;
  }

  accountList: Array<{ id: number, label: string }> = [
    { id: 1, label: 'Moi' },
    { id: 2, label: 'Lui' },
    { id: 3, label: 'Nous' },
  ];

  get isAvailable() {
    return this.id % 2 === 0;
  }

  get teams() {
    return [
      { id: 1, label: 'Bravoure' },
      { id: 2, label: 'Sagesse' },
      { id: 3, label: 'Instinct' },
    ];
  }

  created() {
    if (this.id % 2 === 0) {
      this.accountIds = [];
      this.team = null;
    }
  }

  onCloseManageAccount() {
    this.isExtandedMenuDisplayed = false;
    this.$refs.accountsSelect.blur();
  }

  applyNewCompte() {
    // fake id,
    const id = Math.floor(Math.random() * (100 - 20 + 1) + 20);
    const newAccount = {
      id,
      label: this.newAccount,
    };
    this.accountList.push(newAccount);
    this.accountIds.push(newAccount.id);
    this.newAccount = '';
  }

  removeAccount() {
    const accLower = this.accountToRemove.toLowerCase();

    const { id } = this.accountList.find(account => account.label.toLowerCase() === accLower) || {};
    if (!id) {
      return;
    }

    // remove from selected
    let pos = this.accountIds.findIndex(accountId => accountId === id);
    if (pos > -1) {
      this.accountIds.splice(pos, 1);
    }

    // remove from the available list
    pos = this.accountList.findIndex(account => account.id === id);
    this.accountList.splice(pos, 1);

    this.accountToRemove = '';
  }

  @Prop({ type: Number, required: true })
  id: number;
}
</script>
