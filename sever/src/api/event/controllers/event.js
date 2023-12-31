'use strict';

/**
 * event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::event.event', ({ strapi }) => ({

    async findinfo(ctx) {
        const {id} = ctx.params
        console.log(id)
        //only used by student
        return await super.find(ctx)
    },
    



}));
