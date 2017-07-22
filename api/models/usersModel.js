'use strict';
var AWS = require("aws-sdk");
const uuidv1 = require('uuid/v1');

var docClient = new AWS.DynamoDB.DocumentClient();

function usersModel() {
    this.createUser = function (data, success, error) {
        var params = {
            TableName: 'Users',
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

    this.addBoardtoUser = function (userId, success, error) {
    };

    this.getUser = function (userId, success, error) {
        var params = {
            TableName: 'Users',
            ProjectionExpression: 'ID',//SubscribedBoards
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
                success(data);
            }
        });
    };
};

module.exports = new usersModel();