'use strict';
module.exports = function(app){
    var controller = require('../controllers/usersController');

    app.route('/users/verify/:id_token')
    .post(controller.verify_id_token);
}