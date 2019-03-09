const handlePlaceOrder = (db) => (req, res) => {
	const { id, ship, tax, tot } = req.body;
	db('blu.userorder')
	.insert({uo_userfk: id, ship, tax, tot})
	.returning('order_id')
	.then(order => res.json(order[0]))
	.catch(err => res.status(400).json('cannot complete order'))
}

module.exports = { handlePlaceOrder }