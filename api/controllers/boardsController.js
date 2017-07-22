'user strict';
const uuidv1 = require('uuid/v1');
var model = require("../models/boardsModel");
var usersModel = require("../models/usersModel");

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
        usersModel.getUser(req.body.adminUserId, function (response) {
            response.Items[0].SubscribedBoards.push(item.ID);
            response.Items[0].EditableBoards.push(item.ID);
            usersModel.updateUser(req.body.adminUserId, response.Items[0], function (response) {
                res.json(response);
            }, function (error) {
                res.json(error);
            })
        }, function (error) {
            res.json(error);
        })
    }, function (error) {
        res.json(error);
    });
}

module.exports.get_boards_for_a_user = function (req, res) {

    model.getBoardsByUser(req.params.user_id, function (data) {
        res.json(data);
    }, function (error) {
        res.json(error);
    });
}