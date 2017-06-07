'use strict';
module.exports = function(app){
    var notices = require('../controllers/noticesController');

    app.route('/notices')
    .get(notices.list_all_notices)
    .post(notices.create_a_notice);
}


