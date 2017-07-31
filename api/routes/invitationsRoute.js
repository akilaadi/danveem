'use strict';
module.exports = function(app){
    var controller = require('../controllers/invitationsController');

    app.route('/invitations/:email')
    .get(controller.get_invitations_by_email);   

    app.route('/invitations')
    .post(controller.create_invitation);    

     app.route('/invitations/import/boards')
    .post(controller.import_board_invitations);     
}