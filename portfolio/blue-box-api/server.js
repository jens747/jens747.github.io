const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const fs = require('fs');
const cors = require('cors');
const knex = require('knex');

const spice = require('../orange/src/spicy.js');
const join = require('./controllers/join');
const login = require('./controllers/login');
const name = require('./controllers/name');
const email = require('./controllers/email');
const pass = require('./controllers/pass');
const phone = require('./controllers/phone');
const address = require('./controllers/address');
const pay = require('./controllers/pay');
const addcart = require('./controllers/addcart');
const deletecart = require('./controllers/deletecart');
const placeorder = require('./controllers/placeorder');
const storeorder = require('./controllers/storeorder');
const loadorders = require('./controllers/loadorders'); 
const usaddr = require('./controllers/usaddr');

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

// const yearlyCache = {
// 	dotfiles: 'ignore',
// 	etag: false,
// 	extensions: ['htm', 'html'],
// 	immutable: true,
// 	index: false,
// 	lastModified: false,
// 	maxAge: '1y',
// 	redirect: false,
// 	setHeaders: function (res, path, stat) {
// 		res.set('x-timestamp', Date.now())
// 	}
// }

// const weeklyCache = {
// 	dotfiles: 'ignore',
// 	etag: false,
// 	extensions: ['css', 'js'],
// 	immutable: true,
// 	index: false,
// 	lastModified: false,
// 	// maxAge: 604800,
// 	maxAge: '1w',
// 	redirect: false,
// 	setHeaders: function (res, path, stat) {
// 		res.set('x-timestamp', Date.now())
// 	}
// }

// app.use(express.static('public', yearlyCache));
// app.use(express.static('src', weeklyCache));

// Object.is polyfill, source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
const obis = (x, y) => {
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

const getUserInfo = (req='email', res=email) => { 
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
		.where(`${req}`, '=', `${res}`
	)
}

app.get('/', (req, res) => { res.send("Welcome!"); });

// app.get('/spicy', (req, res) => {
// 	const s = spice;
// 	res.set('Cache-Control', 'public, max-age=604800')
// 	.send(s);
// 	// res.status(304).json('data cached');
// });

app.post('/join', (req, res) => { join.handleJoin(req, res, db, bcrypt) });
app.post('/login', login.handleLogin(db, bcrypt, getUserInfo));

app.put('/name', name.handleName(db));
app.put('/email', email.handleEmail(db));
app.put('/pass', pass.handlePass(db, bcrypt));
app.put('/phone', phone.handlePhone(db));
app.put('/address', address.handleAddress(db));
app.put('/pay', pay.handlePay(db));

app.put('/addcart', addcart.handleAddCart(db));
app.put('/deletecart', deletecart.handleDeleteCart(db));
app.post('/placeorder', placeorder.handlePlaceOrder(db));
app.post('/storeorder', storeorder.handleStoreOrder(db));
app.put('/loadorders', loadorders.handleLoadOrders(db)); 

app.get('/usaddr', (req, res) => { usaddr.handleUsaddr(req, res, fs) });

app.listen(process.env.PORT || 3000);