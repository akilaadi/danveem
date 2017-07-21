'user strict';
var notices = require('./routes/noticesRoute');
var users = require('./routes/usersRoute');
var boards = require('./routes/boardsRoute');

module.exports = function (app) {
    notices(app);
    users(app);
    boards(app);
};