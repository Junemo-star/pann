'use strict';

module.exports = {
  routes: [ //custom routes
    {
      method: 'GET',
      path: '/entries/:id/seedata',
      handler: 'entry.seedata'
    }
  ]
}
