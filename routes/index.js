/* GET home page. */
exports.index = function(req, res){

	res.render('index', { jobName: req.query.job, body: req.text.substring(0,88) + '...' });

};