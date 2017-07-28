'user strict';
const uuidv1 = require('uuid/v1');
var model = require("../models/usersModel");


module.exports.create_user = function (req, res) {

    let item = {
        ID: req.body.userid,
        Name: req.body.name,
        Email: req.body.email,
        EditableBoards:[],
        SubscribedBoards:[]
    };

    model.createUser(item, function (data) {
        res.json(data);
    }, function (error) { 
        res.status(500).send({ error: error });
    });
};

module.exports.get_user = function (req, res) {

    model.getUser(req.params.user_id, function (data) {
        res.json(data);
    }, function (error) { 
        res.status(500).send({ error: error });
    });
};