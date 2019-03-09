const handlePass = (db, bcrypt) => (req, res) => {
	const {id, input } = req.body;
	const hash = bcrypt.hashSync(input);
	db('blu.userlogin')
	.where({user_id: id})
	.update({user_hash: hash})
	.returning('user_id')
	.then(pass => {
		// res.json(pass[0]);
		res.status(200).json('Pasword successfully changed!')
	})
	.catch(err => res.status(400).json('unable to update password'))
}

module.exports = { handlePass }