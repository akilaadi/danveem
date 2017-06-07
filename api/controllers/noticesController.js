'user strict';

module.exports.list_all_notices = function (req, res) {

    res.json([{ id: 12, name: 'testing task' }, { id: 2, name: 'hihi' }]);
};

module.exports.create_a_notice = function (req, res) {

}