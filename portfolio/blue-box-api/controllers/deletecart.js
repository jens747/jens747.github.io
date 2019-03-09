const handleDeleteCart = (db) => (req, res) => {
	const { id, amt } = req.body; 
	db('blu.products')
	.where({prod_id: id})
	.increment('inventory', amt)
	.returning('*')
	.then(cart => res.status(200).json(cart[0]))
	.catch(err => res.status(400).json('unable to delete from cart'))
}

module.exports = { handleDeleteCart }