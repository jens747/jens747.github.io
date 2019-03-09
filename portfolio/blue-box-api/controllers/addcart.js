const handleAddCart = (db) => (req, res) => {
	const { id, itemAmount } = req.body;
	console.log(`id: ${id}, amt: ${itemAmount}`);
	db('blu.products')
	.where({prod_id: id})
	.decrement('inventory', itemAmount)
	.returning('*')
	.then(cart => res.status(200).json(cart[0]))
	.catch(err => res.status(400).json('unable to add to cart'))
}

module.exports = { handleAddCart }