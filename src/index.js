'use strict';
const _ = require('lodash');


module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {
    // how to add controller
    strapi.plugins['users-permissions'].controllers.user.updateMe = async (ctx) => {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();

      const newUserData = _.pick(ctx.request.body.data, ['email', 'password'])

      if (newUserData.username) {
        const usernameExists = await strapi
          .query('plugin::users-permissions.user')
          .findOne({ where: { username: newUserData.username } })

        console.log(usernameExists);
      }


      return {
        ok: "true"
      }

    }

    // how to add the route
    strapi.plugins['users-permissions'].routes['content-api'].routes.unshift({
      method: 'PUT',
      path: '/users/me',
      handler: 'user.updateMe',
      config: {
        prefix: ""
      }
    })
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) { },
};
