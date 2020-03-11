'use strict';

/**
 * A set of functions called "actions" for `Hello`
 */

module.exports = {
  // GET /hello
  index: async ctx => {
    // try {  
    //   // ctx.send('Hello World!');
    //   const entitise = await Hello.find();
    //   return entitise;
    // } catch (error) {
    //   strapi.log.fatal(error); // ctx.log.fatal(error);
    //   ctx.badImplementation(error.message);
    // }
    return await Restaurants.aggregate([]);
  }
};
