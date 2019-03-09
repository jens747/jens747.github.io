const handlePhone = (db) => (req, res) => {
	const { id, input } = req.body; 
	db('blu.userinfo')
	.where({ui_userfk: id})
	.update({phone: input})
	.returning('phone')
	.then(phone => { res.status(200).json('Phone updated.') })
	.catch(err => res.status(400).json('unable to access phone #'))
}

module.exports = { handlePhone }