'use strict';
module.exports = function(app){
    var controller = require('../controllers/noticesController');

    app.route('/notices')
    .get(controller.list_all_notices)
    .post(controller.create_a_notice);
}


