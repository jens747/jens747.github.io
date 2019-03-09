const handleStoreOrder = (db) => (req, res) => {
	const { order, list } = req.body;
	db('blu.orders')
	.insert(list.map(items => {
		return {ord_orderfk: order, ord_prodfk: items.prod_id, prod_price: items.price, qty: items.amt}
	}))
	.returning('ord_orderfk')
	.then(item => res.json(item[0]))
	.catch(err => res.status(400).json('order item was not saved'))
}

module.exports = { handleStoreOrder }