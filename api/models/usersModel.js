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

    this.updateUser = function (userId, data, success, error) {
        var params = {
            TableName: 'Users',
            Key: {
                "ID": userId
            },
            UpdateExpression: "set EditableBoards = :EB, SubscribedBoards=:SB, #NM=:NM, Email=:Email",
            ExpressionAttributeNames: {
                "#NM": "Name"
            },
            ExpressionAttributeValues: {
                ":EB": data.EditableBoards,
                ":SB": data.SubscribedBoards,
                ":NM": data.Name,
                ":Email": data.Email
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

    this.getUser = function (userId, success, error) {
        var params = {
            TableName: 'Users',
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