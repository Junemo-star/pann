'use strict';

/**
 * entry controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::entry.entry', ({ strapi }) => ({

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