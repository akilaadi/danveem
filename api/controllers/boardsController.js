'user strict';
const uuidv1 = require('uuid/v1');
var _ = require('underscore');
var moment = require('moment');
var model = require("../models/boardsModel");
var usersModel = require("../models/usersModel");
var nodemailer = require('nodemailer');

module.exports.create_board = function (req, res) {
    let item = {
        ID: uuidv1(),
        Title: req.body.title,
        Metadata: {
            AdminUsers: [req.body.adminUserId],
            Users: [req.body.adminUserId],
            Notices: []
        },
        CreatedDate: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    model.createBoard(item, function (data) {
        usersModel.getUser(req.body.adminUserId, function (response) {
            response.Items[0].SubscribedBoards.push(item.ID);
            response.Items[0].EditableBoards.push(item.ID);
            usersModel.updateUser(req.body.adminUserId, response.Items[0], function (response) {
                res.json(response);
            }, function (error) {
                res.status(500).send({ error: error });
            })
        }, function (error) {
            res.status(500).send({ error: error });
        })
    }, function (error) {
        res.status(500).send({ error: error });
    });
};

module.exports.get_boards_for_a_user = function (req, res) {

    model.getBoardsByUser(req.params.user_id, function (data) {
        res.json(_.sortBy(data, function (item) {
            return moment(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss').toDate();
        }).reverse());
    }, function (error) {
        res.status(500).send({ error: error });
    });
};

module.exports.get_board = function (req, res) {
    model.getBoard(req.params.boardId, function (data) {
        res.json(data);
    }, function (error) {
        res.status(500).send({ error: error });
    });
};

module.exports.share_board = function (req, res) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ACCOUNT,//'akila.develop@gmail.com',
            pass: process.env.EMAIL_PASSWORD,//'wildbirdSLSL'
        }
    });

    var mailOptions = {
        from: process.env.EMAIL_ACCOUNT,
        to: req.body.email,
        subject: 'Announcement board has been shared with you on Danveem',
        text: 'Please log in to http://danveem-web.ap-southeast-1.elasticbeanstalk.com access your latest announcements.'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(500).send({ error: error });
        } else {
           res.json(info.response);
        }
    });
};