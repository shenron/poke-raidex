<template>
  <v-card
    max-width="344"
    class="mx-auto"
  >
    <v-card-title>
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-badge>
            <span>A partir du 10 Septembre</span>
            <template v-slot:badge><span v-on="on">42</span></template>
          </v-badge>
        </template>
        <span>42 Participants</span>
      </v-tooltip>
    </v-card-title>

    <v-card-text>
      <v-select
        v-model="team"
       :items="teams"
        label="Chez les"
      >
        <v-icon slot="prepend" :color="color">mdi-account</v-icon>
      </v-select>

      <v-select
        v-model="accounts"
        :items="accountList"
        label="Comptes"
        multiple
        chips
        hint="Mes petits comptes"
        persistent-hint
      >
       <template v-slot:append-item>
         <v-divider class="mb-2"></v-divider>
         <v-list-item>
           <v-list-item-content>
             <form>
               <v-text-field v-model="newAccount" label="Nouveau compte">
                  <v-btn slot="append" @click="applyNewCompte"><v-icon>mdi-plus</v-icon></v-btn>
               </v-text-field>
               <v-text-field v-model="accountToRemove" label="Suppression compte">
                  <v-btn slot="append" @click="removeAccount"><v-icon>mdi-minus</v-icon></v-btn>
               </v-text-field>
             </form>
           </v-list-item-content>
         </v-list-item>
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
            <v-btn color="green darken-1" text @click="savedModal = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-if="!isAvailable" v-model="leaveDialog" persistent max-width="290">
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
            <v-btn color="green darken-1" text @click="leaveDialog = false">Oui</v-btn>
            <v-btn color="green darken-1" text @click="leaveDialog = false">Non</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';

export default
@Component
class RaidEx extends Vue {
  leaveDialog: boolean = false;

  savedModal: boolean = false;

  team: string = 'Bravoure';

  accounts: Array<string> = ['Moi', 'Lui'];

  newAccount: string = '';

  accountToRemove: string = '';

  get color() {
    let color = '';
    switch (this.team) {
      case 'Bravoure': {
        color = 'red';
        break;
      }
      case 'Sagesse': {
        color = 'blue';
        break;
      }
      case 'Instinct': {
        color = 'yellow';
        break;
      }
      default: {
        color = '';
      }
    }
    return color;
  }

  accountList: Array<String> = ['Moi', 'Lui', 'Nous'];

  get isAvailable() {
    return this.id % 2 === 0;
  }

  get teams() {
    return ['Bravoure', 'Sagesse', 'Instinct'];
  }

  created() {
    if (this.id % 2 === 0) {
      this.accounts = [];
      this.team = null;
    }
  }

  applyNewCompte() {
    this.accountList.push(this.newAccount);
    this.accounts.push(this.newAccount);
    this.newAccount = '';
  }

  removeAccount() {
    let pos = this.accounts.map(account => account.toLowerCase()).indexOf(this.accountToRemove.toLowerCase());

    if (pos > -1) {
      this.accounts.splice(pos, 1);
    }

    pos = this.accountList.map(account => account.toLowerCase()).indexOf(this.accountToRemove.toLowerCase());

    if (pos > -1) {
      this.accountList.splice(pos, 1);
    }

    this.accountToRemove = '';
  }

  @Prop({ type: Number, required: true })
  id: number;
}
</script>
