// @flow

import { Component } from 'vue-property-decorator';

// Register the router hooks with their names
Component.registerHooks([
  'errorCaptured',
  'errorHandler', // use by VErrorHandler
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate', // for vue-router 2.2+
]);
