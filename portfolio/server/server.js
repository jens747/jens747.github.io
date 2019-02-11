const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const fs = require('fs');
const cors = require('cors');
const knex = require('knex');
const spice = require('../orange/src/spicy.js');
// const spice = require('../jens747.github.io/portfolio/orange/spicy.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'postgres',
		password: 'postgres',
		database: 'orange'
	}
});

const yearlyCache = {
	dotfiles: 'ignore',
	etag: false,
	extensions: ['htm', 'html'],
	immutable: true,
	index: false,
	lastModified: false,
	maxAge: '1y',
	redirect: false,
	setHeaders: function (res, path, stat) {
		res.set('x-timestamp', Date.now())
	}
}

const weeklyCache = {
	dotfiles: 'ignore',
	etag: false,
	extensions: ['css', 'js'],
	immutable: true,
	index: false,
	lastModified: false,
	maxAge: '1w',
	redirect: false,
	setHeaders: function (res, path, stat) {
		res.set('x-timestamp', Date.now())
	}
}

app.use(express.static('public', yearlyCache));
app.use(express.static('src', weeklyCache));

const obis = (x, y) => {
		// Object.is polyfill, source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
	if (!Object.is) {
	  Object.is = function(x, y) {
	    // SameValue algorithm
	    if (x === y) { // Steps 1-5, 7-10
	      // Steps 6.b-6.e: +0 != -0
	      return x !== 0 || 1 / x === 1 / y;
	    } else {
	      // Step 6.a: NaN == NaN
	      return x !== x && y !== y;
	    }
	  }
	}
}

const getUserInfo = (rec='email', res=email) => {
	// console.log(email);
	console.log(res);
	return db.select('user_id', 'email', 'user_hash', 'joined',
		'first_name', 'last_name', 'street', 'ui_statefk', 'zip', 'phone',
		'state_code', 'city',
		'cc_no', 'exp_mo', 'exp_yr', 'sec_no', 'card_co'
		)
		.from('blu.userlogin')
		.join('blu.userinfo', {'blu.userlogin.user_id': 'blu.userinfo.ui_userfk'})
		.join('blu.locstate', {'blu.userinfo.ui_statefk': 'blu.locstate.state_id'})
		.join('blu.loccity', {'blu.userinfo.ui_cityfk': 'blu.loccity.city_id'})
		.join('blu.payinfo', {'blu.userlogin.user_id': 'blu.payinfo.pi_userfk'})
		.where(`${rec}`, '=', `${res}`)
}

app.get('/', (req, res) => {
	res.send("Welcome!");
});

app.post('/account', (req, res) => {
	console.log(req.body);
	const user = {
		name: 'John',
		password: 'Soccer'
	};

	// res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(user));
});

app.get('/spicy', (req, res) => {
	const s = spice;
	res.send(s);
});

app.post('/join', (req, res) => {
	const { email, user, pw, pw2 } = req.body;
	// ************************NEEDS WORK************************* //
	// need to add checks against XXS attacks i.e.: <script>alert('oops!')</script>
	// preventing use of special characters like script tags, etc.
	const valid = new RegExp(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);

	if (!valid.test(email)) { throw res.status(400).json('bad info'); }
	if (pw !== pw2 || pw === '') { throw res.status(400).json('passwords do not match'); }
	
	const hash = bcrypt.hashSync(pw);
	db.transaction(trx => {
		trx.insert({
			user_hash: hash,
			email: email
		})
		.into('blu.userlogin')
		.returning('user_id')
		// .then(data => {
		// 	return trx('blu.userlogin')
		// 		.returning('*')
		// 		.insert({
		// 			user_name: data[0],
		// 			// joined: new Date()
		// 		})
				// .then(id => {
				// 	console.log(`id: ${id}`);
				// 	res.status(200).json('account joined');
				// })
				.then(id => {
					return trx('blu.userinfo')
						.returning('ui_userfk')
						.insert({ ui_userfk: id[0] })
						.then(id => {
							return trx('blu.payinfo')
								.returning('pi_userfk')
								// .returning(['pi_userfk', 'cc_no', 'exp_mo', 'exp_yr', 'sec_no', 'card_co'])
								.insert({ pi_userfk: id[0] })
								.then(success => {
									res.json(success[0]);
									// res.status(200).json('account joined');
								})
						})
						.catch(err => res.status(400).json('no data match'));
				})
		// })
		.then(trx.commit)
		.catch(trx.rollback);
	})
	.catch(err => res.status(400).json('failed to join'));
});

app.post('/login', (req, res) => {
	const { email, pass } = req.body;
	// ************************NEEDS WORK************************* //
	// need to add checks against XXS attacks i.e.: <script>alert('oops!')</script>
	// preventing use of special characters like script tags, etc.
	const valid = new RegExp(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
	if (!valid.test(email)) { throw res.status(400).json('bad info'); }

	db.select('email', 'user_hash').from('blu.userlogin')
		.where('email', '=', email)
		.then(data => {
			if (email === 0) { 
				return res.status(400).json('empty field'); 
			}
			// if(!obis(data[0].email, 'joe@gmail.com')) {
			// 	return res.status(400).json('empty field');
			// }
			const isValid = bcrypt.compareSync(pass, data[0].user_hash);
			if (isValid) {
				// return db.select('*').from('blu.userlogin')
					// .where('email', '=', req.body.email)
				getUserInfo('email', email)
				.then(user => {
					console.log(user[0]);
					res.json(user[0]);
				})
				.catch(err => res.status(400).json('no match found'));
			} else {
				throw res.status(400).json('invalid credentials');
			}
		})
		.catch(err => res.status(400).json('access denied'));
});

app.put('/name', (req, res) => {
	const { id, input } = req.body;
	console.log(id, input);
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
	// db.select('ui_userfk', 'first_name', 'last_name', 'phone')
	// .from('blu.userinfo').where({ ui_userfk: id })
	.then(name => {
		console.log(`Name: ${name[0].first_name} ${name[0].last_name}`);
		res.json(`${name[0].first_name} ${name[0].last_name}`);
	})
	.catch(err => res.status(400).json('unable to access name info'))
});

app.put('/email', (req, res) => {
	const { id, input } = req.body;
	console.log(`id: ${id}, email: ${input}`);
	db('blu.userlogin')
	.where({user_id: id})
	.update({email: input})
	.returning('email')
	.then(email => {
		res.json(email[0]);
	})
	.catch(err => res.status(400).json('unable to access email'))
});

app.put('/pass', (req, res) => {
	const {id, input } = req.body;
	const hash = bcrypt.hashSync(input);
	db('blu.userlogin')
	.where({user_id: id})
	.update({user_hash: hash})
	.returning('user_id')	.then(pass => {
		// res.json(pass[0]);
		res.status(200).json('Pasword successfully changed!')
	})
	.catch(err => res.status(400).json('unable to update password'))
});

app.put('/phone', (req, res) => {
	const { id, input } = req.body;
	console.log(id, input);
	db('blu.userinfo')
	.where({ui_userfk: id})
	.update({phone: input})
	.returning('phone')
	.then(phone => {
		// console.log(`Phone: ${phone[0]}`);
		// res.json(phone[0]);
		res.status(200).json('Phone updated.')
	})
	.catch(err => res.status(400).json('unable to access phone #'))
});

app.put('/address', (req, res) => {
	const { id, cities, street } = req.body;
	// console.log(id, cities, street);
	const loc = cities.split(',');
	const city = loc[0];
	const codes = loc[1].split(' ');
	// console.log(`loc1: ${loc[1]}`);
	// console.log(codes);
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
	// using a raw expression, may work for other applications
	// .from(db.raw('?? (??)', ['blu.userinfo', 'ui_statefk']))
	// .insert(function() {
	// 	this.from('blu.locstate')
	// 	.where({ state_code: codes[1] })
	// 	.select('state_id')
	// })
	.returning('*')
	.then(addr => {
		res.status(200).json('Address updated.');
		// res.json(addr[0].ui_statefk);
	})
	.catch(err => res.status(400).json('unable to access address info'))
});

app.put('/pay', (req, res) => {
	const { id, cc_no, exp_mo, exp_yr, sec_no, card_co } = req.body;
	db('blu.payinfo')
	.where({pi_userfk: id})
	.update({ cc_no, exp_mo, exp_yr, sec_no, card_co })
	.returning(['cc_no', 'exp_mo', 'exp_yr', 'sec_no', 'card_co', 'card_co'])
	.then(pay => {
		// console.log(`pay: ${pay[0].cc_no} ${pay[0].exp_mo} ${pay[0].exp_yr} ${pay[0].sec_no}`);
		res.json(pay[0]);
	})
	.catch(err => res.status(400).json('unable to access payment info'))
});

app.put('/addcart', (req, res) => {
	const { id, itemAmount } = req.body;
	console.log(`id: ${id}, amt: ${itemAmount}`);
	db('blu.products')
	.where({prod_id: id})
	.decrement('inventory', itemAmount)
	.returning('*')
	.then(cart => {
		res.json(cart[0]);
	})
	.catch(err => res.status(400).json('unable to add to cart'))
});


app.put('/deletecart', (req, res) => {
	const { id, amt } = req.body;
	console.log(`id: ${id}, amt: ${amt}`);
	db('blu.products')
	.where({prod_id: id})
	.increment('inventory', amt)
	.returning('*')
	.then(cart => {
		res.json(cart[0]);
	})
	.catch(err => res.status(400).json('unable to delete from cart'))
});

app.post('/placeorder', (req, res) => {
	const { id, ship, tax, tot } = req.body;
	db('blu.userorder')
	.insert({uo_userfk: id, ship, tax, tot})
	.returning('order_id')
	.then(order => {
		res.json(order[0]);
	})
	.catch(err => res.status(400).json('cannot complete order'))
});

app.post('/storeorder', (req, res) => {
	const { order, list } = req.body;
	db('blu.orders')
	.insert(list.map(items => {
		return {ord_orderfk: order, ord_prodfk: items.prod_id, prod_price: items.price, qty: items.amt}
	}))
	.returning('ord_orderfk')
	.then(item => {
		res.json(item[0]);
	})
	.catch(err => res.status(400).json('order item was not saved'))
});

// app.get('/account/:id', (req, res) => {
// 	const { id } = req.params;
	
// 	db.select('*').from('blu.userlogin')
// 		.where({user_id: id})
// 		.then(data => {
// 			if (data.length) {
// 				res.json(data);
// 			} else {
// 				res.status(404).json('no user found');
// 			}
// 		})
// 		.catch(err => res.status(400).json('no data'));
// 	// db.cust.forEach(user => {
// 	// 	if (user.id === id) {
// 	// 		found = true;
// 	// 		return res.json(user);
// 	// 	} 
// 	// 	if (!found) {
// 	// 		res.status(404).json('no user exists');
// 	// 	}
// 	// })
// })

app.get('/usaddr', (req, res) => {
	fs.readFile('../orange/public/us-min.txt', (err, data) => {
		if (data === undefined) { 
			throw res.status(400).json('Could not get city.');
		}
		const cities = data.toString().split('\n');
		res.json(cities);

		// convert csv file to remove newline, case return, and tabs
		// const cities = data.toString().split('\r\n');
		// const city = cities.map(num => num.split('\t'));
		// const visit = city.map((num, idx) => {
		// 	console.log(`${city[idx][0]}, ${city[idx][1]} ${city[idx][2]} ${city[idx][3]}`)
		// });
		// console.log(`${city[0]}, ${city[1]} ${city[2]} ${city[3]}`);
		
		// fs.writeFile('../orange/ussm.txt', cities, (err, data) => data);
		// const citys = cities.toString().split('\t');
		// fs.writeFile('../orange/ussm.txt', citys, (err, data) => data);
		// const citis = citys.toString().split(',');
		// fs.writeFile('../orange/ussm.txt', citis, (err, data) => data);
		// console.log(citis);

		// formats csv file as "city, state zip"
		// let cities = data.toString().split(',')
		// cities.toString().replace(',', '\n');
		// const citi = cities.map((num, idx) => {
		// 	if (idx % 3 === 0) {
		// 		return `${cities[idx]}; ${cities[idx + 1]} ${cities[idx + 2]}\n`;
		// 	}
		// })
		// const city = citi.filter((num, idx) => idx % 3 === 0);
		// console.log(city);
		// fs.writeFile('../orange/us-csv.txt', city, (err, data) => data);
	});
});

app.listen(3000);