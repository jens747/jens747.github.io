const handleName = (db) => (req, res) => {
	const { id, input } = req.body; 
	const names = input.split(' ');
	const fn = names[0];
	if (names.length < 2 
		? ln = "" 
		: names.length > 2
			? ln = names.filter((num, idx) => idx > 0).join(' ')
			: ln = names[1]);
	db('blu.userinfo')
	.where({ui_userfk: id})
	.update({first_name: fn, last_name: ln})
	.returning(['first_name','last_name']) 
	// .then(name => res.json(`${name[0].first_name} ${name[0].last_name}`))
	.then(name => res.json(name[0]))
	.catch(err => res.status(400).json('unable to access name info'));
}

module.exports = { handleName: handleName }