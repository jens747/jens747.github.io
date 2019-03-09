const handleEmail = (db) => (req, res) => {
	const { id, input } = req.body; 
	db('blu.userlogin')
	.where({user_id: id})
	.update({email: input})
	.returning('email')
	.then(email => res.status(200).json(email[0]))
	.catch(err => res.status(400).json('unable to access email'))
}

module.exports = { handleEmail }