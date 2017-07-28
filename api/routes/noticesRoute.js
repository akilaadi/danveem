'use strict';
module.exports = function(app){
    var controller = require('../controllers/noticesController');

    app.route('/notices')
    .post(controller.create_notice);

    app.route('/notices/:noticId')
    .get(controller.get_notice);   

    app.route('/notices/board/:boardId')
    .get(controller.get_all_notices_for_a_board);    
}


