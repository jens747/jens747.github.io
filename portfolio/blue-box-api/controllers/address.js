const handleAddress = (db) => (req, res) => {
	const { id, cities, street } = req.body;
	const loc = cities.split(',');
	const city = loc[0];
	const codes = loc[1].split(' ');

	db.select('*')	
	.from('blu.userinfo')
	.where({ ui_userfk: id })
	.update({
		ui_cityfk: function() {
			this.from('blu.loccity')
			.where({ city: city })
			.select('city_id')
		}, 
		ui_statefk: function() {
			this.from('blu.locstate')
			.where({ state_code: codes[1] })
			.select('state_id')
		},
		street: street,
		zip: codes[2]
	})
	.returning('*')
	// .then(addr => res.status(200).json('Address updated.'))
	.then(addr => res.status(200).json(addr[0]))
	.catch(err => res.status(400).json('unable to access address info'))
}

module.exports = { handleAddress }