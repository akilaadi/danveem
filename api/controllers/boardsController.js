'user strict';
const uuidv1 = require('uuid/v1');
var model = require("../models/boardsModel");

module.exports.create_board = function (req, res) {
    let item = {
        ID: uuidv1(),
        Title: req.body.title,
        Metadata: {
            AdminUsers: [req.body.adminUserId],
            Users: [req.body.adminUserId]
        }
    };

    model.createBoard(item, function (data) {
        res.json(data);
    }, function (error) {
         res.json(error);
    });
}

module.exports.get_boards_for_a_user = function (req, res) {

    model.getBoardsByUser(req.body.userid, function (data) {
        res.json(data);
    }, function (error) {});
}