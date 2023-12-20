'use strict';

module.exports = {
    routes: [
      {
        method: "GET",
        path: '/events/:id/entries',
        handler: 'event.listEntries'
      },
      {
        method: "POST",
        path: '/events/:id/entries',
        handler: 'event.postEntries'
      }
    ]
  };