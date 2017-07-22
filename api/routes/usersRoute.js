'use strict';
module.exports = function(app){
    var controller = require('../controllers/usersController');

    app.route('/users/:user_id')
    .get(controller.get_user);   

    app.route('/users')
    .post(controller.create_user);    
}