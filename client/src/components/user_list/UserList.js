// @flow

import { Component, Vue } from 'vue-property-decorator';

export default
@Component
class UserList extends Vue {
  get headers() {
    return [{
      text: 'Joueur',
      align: 'left',
      sortable: false,
      value: 'name',
    }];
  }

  get players() {
    return [{
      id: 1,
      name: 'Toto',
    }, {
      id: 2,
      name: 'TATA',
    }];
  }
}
