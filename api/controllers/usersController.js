'user strict';

module.exports.list_all_users = function (req, res) {

    res.json([{ id: 12, name: 'testing task' }, { id: 2, name: 'hihi' }]);
};

module.exports.verify_id_token = function (req, res) {
}