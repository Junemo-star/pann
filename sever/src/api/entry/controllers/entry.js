'use strict';

/**
 * entry controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::entry.entry', ({ strapi }) => ({

    async seedata(ctx) {
        const entityId = ctx.params.id;
        try {
            let see = await strapi.entityService.findOne("api::entry.entry", entityId);
            see = await strapi.entityService.update('api::entry.entry', entityId, { 
                data: { 
                    seedata: new Date()
                }, 
            })
            ctx.body = {}
        } catch (err) {
            ctx.body = err;
        }
    },

    async listEntries(ctx) {
        const entityId = ctx.params.id;
        try {
            ctx.body = { ok: 1 };
        } catch (err) {
            ctx.body = err;
        }
    },

    async postEntries(ctx) {
        const entityId = ctx.params.id;
        try {
            ctx.body = { ok: 1 };
        } catch (err) {
            ctx.body = err;
        }
    }
}));