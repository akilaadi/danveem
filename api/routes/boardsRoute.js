'use strict';
module.exports = function(app){
    var boards = require('../controllers/boardsController');

    app.route('/boards')
    .get(boards.list_all_boards)
    .post(boards.create_a_board);
}


