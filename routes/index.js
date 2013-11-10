
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'ぷよぷよ' });
};

exports.login = function(req, res) {
	res.render('login', { title: 'ログイン'});
};

exports.main = function(req, res) {
	res.render('main', { title: 'ロビー', username: "req.user.username"});
};
