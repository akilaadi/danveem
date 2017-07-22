'use strict';
var AWS = require("aws-sdk");
const uuidv1 = require('uuid/v1');

var docClient = new AWS.DynamoDB.DocumentClient();

function boardsModel() {
    this.createBoard = function (data, success, error) {
        var params = {
            TableName: 'Boards',
            Item: data
        };

        docClient.put(params, function (err, data) {
            if (err) {
                error(err);
            } else {
                success(data);
            }
        });
    };

    this.getBoardIdsByUser = function (userId, success, error) {
        var params = {
            TableName: 'Users',
            ProjectionExpression: 'SubscribedBoards',
            KeyConditionExpression: '#ID = :userid',
            ExpressionAttributeNames: {
                "#ID": "ID"
            },
            ExpressionAttributeValues: {
                ":userid": userId
            }
        };

        docClient.query(params, function (err, data) {
            if (err) {
                error(err);
            } else {
                success(data);
            }
        });
    };

    this.getBoardsByUser = function (userId, success, error) {
        this.getBoardIdsByUser(userId, function (boardIds) {
            var params = {
                TableName: 'Boards',
                ProjectionExpression: '#ID, Title, AnnouncementList, Metadata',
                KeyConditionExpression: '#ID IN (:boardIds)',
                ExpressionAttributeNames: {
                    "#ID": "ID"
                },
                ExpressionAttributeValues: {
                    ":boardIds": boardIds
                }
            };

            docClient.query(params, function (err, data) {
                if (err) {
                    error(err);
                } else {
                    success(data);
                }
            });
        }, error);
    };
};

module.exports = new boardsModel();