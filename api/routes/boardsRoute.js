'use strict';
module.exports = function(app){
    var controller = require('../controllers/boardsController');

    app.route('/boards')
    .post(controller.create_board);
 
    app.route('/boards/user/:user_id')
    .get(controller.get_boards_for_a_user);   
}


