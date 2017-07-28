'use strict';
var AWS = require("aws-sdk");
const uuidv1 = require('uuid/v1');

var docClient = new AWS.DynamoDB.DocumentClient();

function noticesModel() {

    this.createNotice = function (data, success, error) {
        var params = {
            TableName: 'Notices',
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

    this.getNoticesIdsByBoard = function (boardId, success, error) {
        var params = {
            TableName: 'Boards',
            KeyConditionExpression: '#ID = :boardid',
            ExpressionAttributeNames: {
                "#ID": "ID"
            },
            ExpressionAttributeValues: {
                ":boardid": boardId
            }
        };

        docClient.query(params, function (err, data) {
            if (err) {
                error(err);
            } else {
                success(data.Items[0].Metadata.Notices);
            }
        });
    };

    this.getNoticesByBoard = function (boardId, success, error) {
        this.getNoticesIdsByBoard(boardId, function (noticesIds) {
            if (noticesIds.length > 0) {
                var expressionAttributeValues = {};
                noticesIds.forEach(function (element, index) {
                    expressionAttributeValues[":val" + index] = element;
                }, this);

                var params = {
                    TableName: 'Notices',
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

    this.getNotice = function(noticeId,success,error){
         var params = {
            TableName: 'Notices',
            KeyConditionExpression: '#ID = :noticeId',
            ExpressionAttributeNames: {
                "#ID": "ID"
            },
            ExpressionAttributeValues: {
                ":noticeId": parseInt(noticeId)
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

module.exports = new noticesModel();