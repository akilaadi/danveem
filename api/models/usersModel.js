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
                "ID": parseInt(userId)
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
                success(data.Items[0]);
            }
        });
    };

    this.getUserByEmail = function (email, success, error) {
        var params = {
            TableName: 'Users',
            FilterExpression: '#Email = :email',
            ExpressionAttributeNames: {
                "#Email": "Email"
            },
            ExpressionAttributeValues: {
                ":email": email
            }
        };

        docClient.scan(params, function (err, data) {
            if (err) {
                error(err);
            } else {
                success(data.Items[0]);
            }
        });
    };

    this.getUsers = function (userIds, success, error) {
        var expressionAttributeValues = {};
        userIds.forEach(function (element, index) {
            expressionAttributeValues[":val" + index] = element;
        }, this);

        var params = {
            TableName: 'Users',
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
    };
};

module.exports = new usersModel();