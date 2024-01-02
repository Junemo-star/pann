'use strict';

/**
 * event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::event.event', ({ strapi }) => ({

    async findinfo(ctx) {
        //only used by student
        return await super.find(ctx)
    },
    



}));
