const handleLoadOrders = (db) => (req, res) => {
	const { id } = req.body; 

	db.select('order_id', 'uo_userfk', 'product', 'qty', 'prod_price', 'tax', 'ship', 'tot', 'order_date')
	.from('blu.userorder as a')
	.join('blu.orders as b', {'a.order_id': 'b.ord_orderfk'})
	.join('blu.products as c', {'b.ord_prodfk': 'c.prod_id'})
	.where('a.uo_userfk', '=', `${id}`)
	.orderBy('order_id')
	.returning('*')
	.then(orders => res.status(200).json(orders))
	.catch(err => res.status(400).json('unable to access orders'))
}

module.exports = { handleLoadOrders }