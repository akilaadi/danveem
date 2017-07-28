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

     this.updateBoard = function (boardId, data, success, error) {
        var params = {
            TableName: 'Boards',
            Key: {
                "ID": boardId
            },
            UpdateExpression: "set Title = :T, Metadata=:MT",
            ExpressionAttributeValues: {
                ":T": data.Title,
                ":MT": data.Metadata
            },
            ReturnValues: "UPDATED_NEW"
        };
        docClient.update(params, function (err, data) {
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
                ":userid": parseInt(userId)
            }
        };

        docClient.query(params, function (err, data) {
            if (err) {
                error(err);
            } else {
                success(data.Items[0].SubscribedBoards);
            }
        });
    };

    this.getBoardsByUser = function (userId, success, error) {
        this.getBoardIdsByUser(userId, function (boardIds) {
            if (boardIds.length > 0) {
                var expressionAttributeValues = {};
                boardIds.forEach(function (element, index) {
                    expressionAttributeValues[":val" + index] = element;
                }, this);

                var params = {
                    TableName: 'Boards',
                    FilterExpression: '#ID IN (' + Object.keys(expressionAttributeValues).join(',') + ')',
                    ExpressionAttributeNames: {
                        "#ID": "ID"
                    },
                    ExpressionAttributeValues: expressionAttributeValues
                };

                docClient.scan(params, function (err, data) {
                    if (err) {
                        error(err);
                    } else {
                        success(data.Items);
                    }
                });
            }
            else{
                success([]);
            }
        }, error);
    };

    this.getBoard = function(boardId,success,error){
         var params = {
            TableName: 'Boards',
            KeyConditionExpression: '#ID = :boardId',
            ExpressionAttributeNames: {
                "#ID": "ID"
            },
            ExpressionAttributeValues: {
                ":boardId": boardId
            }
        };

        docClient.query(params, function (err, data) {
            if (err) {
                error(err);
            } else {
                success(data.Items[0]);
            }
        });       
    };
};

module.exports = new boardsModel();