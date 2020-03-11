'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    index: async ctx => {
        // try {
        //   // ctx.send('Hello World!');
        //   const entitise = await Hello.find();
        //   return entitise;
        // } catch (error) {
        //   strapi.log.fatal(error); // ctx.log.fatal(error);
        //   ctx.badImplementation(error.message);
        // }
        const model = strapi.models.restaurant;

        try {
            return await model.aggregate(
                [{ $group: {_id: "$name"}}]
             );
        } catch (error) {
            strapi.log.fatal(error);
            ctx.log.fatal(error);
            ctx.badImplementation(error.message);
        }
      },
    create_random: async ctx => {
      const Chance = require('chance');
      const chance = new Chance();

        const MongoClient = require('mongodb').MongoClient;
        const url = "mongodb://localhost:27017/";

        function random_string(length) {
            let result           = '';
            let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let charactersLength = characters.length;
            for ( let i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
         }

        function create_array() {
            let array_restaurants = [];

              for (let index = 0; index < 5000; index++) {
                const element = {
                  name: random_string(10 + index),
                  description: random_string(20 + index),
                  location: {
                    type: 'Point',
                    coordinates: [
                      chance.floating({min: 102.5625, max: 107.18811}),
                      chance.floating({min: 10.48291, max: 14.18175})]
                  }
                };
                array_restaurants.push(element);
              }
            return array_restaurants;
        }



        try {
            await MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                const dbo = db.db("first-project");
                const array_restaurants = create_array();
                dbo.collection("restaurants").insertMany(array_restaurants, function(err, res) {
                  if (err) throw err;
                  console.log("Number of documents inserted: " + res.insertedCount);
                  db.close();
                });
            });
            return ctx.body = {
              statusCode: 200,
              msg: "Sample data added!"
            }
        } catch (error) {
            strapi.log.fatal(error);
            ctx.log.fatal(error);
            ctx.badImplementation(error.message);
        }
    },
    near: async ctx => {
      const model = strapi.models.restaurant;
      const lat = parseFloat(ctx.request.body['lat']);
      const lng = parseFloat(ctx.request.body['lng']);
      const scopeMax = parseFloat(ctx.request.body['scopeMax']);

      const pattern = [
        {
          $geoNear: {
            near : {
              type: "Point",
              coordinates: [lng, lat]
            },
            distanceField: "dist.calculated",
            includeLocs:"dist.location",
            maxDistance: scopeMax,
            spherical :true,
          }
        }
      ];
      try {
        const datas = await model.aggregate(
          pattern
        );
        return datas;
      } catch (error) {
        strapi.log.fatal(error);
        ctx.log.fatal(error);
        ctx.badImplementation(error.message + {
          lat: lat,
          lng: lng
        });
      }
    }

};
