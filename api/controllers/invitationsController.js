'user strict';
const uuidv1 = require('uuid/v1');
var _ = require('underscore');
var moment = require('moment');
var invitationsModel = require("../models/invitationsModel");
var boardsModel = require("../models/boardsModel");
var usersModel = require("../models/usersModel");


module.exports.create_invitation = function (req, res) {
    if (req.body.invitationType === 'NewBoard') {
        let item = {
            ID: uuidv1(),
            Email: req.body.inviteeEmail,
            SentBy: req.body.userId,
            CreatedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            InvitationData: req.body.boardId,
            InvitationType: req.body.invitationType
        };
        invitationsModel.createInvitation(item, function (data) {
            res.json(data);
        }, function (error) {
            res.status(500).send({ error: error });
        });
    }
};

module.exports.import_board_invitations = function (req, res) {
    usersModel.getUser(req.body.userId, function (user) {
        boardsModel.getBoardsByUser(req.body.userId, function (existingBoards) {
            invitationsModel.getInvitationsByEmail(user.Email, function (invitations) {
                let newBoards = [];
                invitations.forEach(function (element) {
                    let existingBoardIndex = _.findIndex(existingBoards, { ID: element.InvitationData });
                    if (existingBoardIndex === -1 && !_.contains(newBoards, element.InvitationData)) {
                        newBoards.push(element.InvitationData);
                    }
                });
                if (newBoards.length > 0) {
                    user.SubscribedBoards = user.SubscribedBoards.concat(newBoards);
                    usersModel.updateUser(req.body.userId, user, function (response) {
                        boardsModel.getBoards(newBoards, function (response) {
                            Promise.all(response.map(board => {
                                return new Promise((resolve, reject) => {
                                    board.Metadata.Users.push(parseInt(req.body.userId));
                                    boardsModel.updateBoard(board.ID, board, response => {
                                        resolve(response);
                                    }, error => {
                                        reject(response);
                                    });
                                });
                            })).then(data => {
                                res.json(data);
                            }).catch(error => {
                                res.status(500).send({ error: error });
                            });
                        }, function (error) {
                            res.status(500).send({ error: error });
                        });
                    }, function (error) {
                        res.status(500).send({ error: error });
                    });
                }
                else {
                    res.json([]);
                }
            }, function (error) {
                res.status(500).send({ error: error });
            });
        }, function (error) {
            res.status(500).send({ error: error });
        });
    }, function (error) {
        res.status(500).send({ error: error });
    });
};

module.exports.get_invitations_by_email = function (req, res) {
    invitationsModel.getInvitationsByEmail(user.Email, function (invitations) {
        res.json(invitations);
    }, function (error) {
        res.status(500).send({ error: error });
    });
};