'use strict';
var AWS = require("aws-sdk");
const uuidv1 = require('uuid/v1');

var docClient = new AWS.DynamoDB.DocumentClient();

function invitationsModel() {

    this.createInvitation = function (data, success, error) {
        var params = {
            TableName: 'UserInvitations',
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

    this.updateInvitation = function (invitationId, data, success, error) { 
        var params = {
            TableName: 'UserInvitations',
            Key: {
                "ID": userId
            },
            UpdateExpression: "set InviteeEmail = :InviteeEmail, SentBy=:SentBy, CreatedDate=:CreatedDate, InvitationData=:InvitationData, InvitationType=:InvitationType",
            ExpressionAttributeNames: {
                "#NM": "Name"
            },
            ExpressionAttributeValues: {
                ":InviteeEmail": data.InviteeEmail,
                ":SentBy": data.SentBy,
                ":CreatedDate": data.CreatedDate,
                ":InvitationData": data.InvitationData,
                ":InvitationType": data.InvitationType,                
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

    this.getInvitationsByEmail = function (email, success, error) {
        var params = {
            TableName: 'UserInvitations',
            FilterExpression: '#Email = :email',
            ExpressionAttributeNames: {
                "#Email": "InviteeEmail"
            },
            ExpressionAttributeValues: {
                ":email": email
            }
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

module.exports = new invitationsModel();