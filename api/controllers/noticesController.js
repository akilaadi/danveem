'user strict';
const uuidv1 = require('uuid/v1');
var _ = require('underscore');
var moment = require('moment');
var noticesodel = require("../models/noticesModel");
var boardsModel = require("../models/boardsModel");
var usersModel = require("../models/usersModel");

module.exports.get_all_notices_for_a_board = function (req, res) {

    noticesodel.getNoticesByBoard(req.params.boardId, function (data) {
        res.json(_.sortBy(data,function(item){
            return moment(item.CreatedDate,'YYYY-MM-DD HH:mm:ss').toDate();
        }).reverse());
    }, function (error) {
         res.status(500).send({ error: error });
    });
};

module.exports.get_notice = function (req, res) {

    noticesodel.getNotice(req.params.noticeId, function (data) {
        res.json(data);
    }, function (error) {
         res.status(500).send({ error: error });
    });
};

module.exports.create_notice = function (req, res) {
    let item = {
        ID: uuidv1(),
        Title: req.body.title,
        Metadata: {
            AuthorID: parseInt(req.body.userId),
            BoardID:req.body.boardId
        },
        CreatedDate:moment().format('YYYY-MM-DD HH:mm:ss'),
        Content: req.body.content
    };

    noticesodel.createNotice(item, function (data) {
        boardsModel.getBoard(req.body.boardId, function (response) {
            response.Metadata.Notices.push(item.ID);
            boardsModel.updateBoard(req.body.boardId, response, function (response) {
                res.json(response);
            }, function (error) {
                 res.status(500).send({ error: error });
            });
        }, function (error) {
             res.status(500).send({ error: error });
        })
    }, function (error) {
        res.status(500).send({ error: error });
    });
}