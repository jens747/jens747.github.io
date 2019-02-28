/********************************************/
/* displays join, login, bag menu when clicked */
/********************************************/
// 0.Class added, 1-2(required obj),>=5. adds class 3-4. removes class
const openMenus = (...elements) => {
	const list = elements.length;
	const item = elements[0];
	const elm1 = elements[1].classList;
	const filtered = elements.filter(num => typeof num === 'object'); 

	if (list > 3 && elements[3] !== 0) 
		filtered.splice(2, 2).map(num => num.classList.remove(item));

	if (elm1.contains(item) === true
		? filtered.map(num => num.classList.remove(item))
		: filtered.map(num => num.classList.add(item)));
}

const addClasses = (cls, ...elm) => elm.map(list => list.classList.add(cls));
const rmClasses = (cls, ...elm) => elm.map(list => list.classList.remove(cls));
const tglClasses = (cls, ...elm) => elm.map(list => list.classList.toggle(cls));

const setupClassList = (elm, ...cls) => {
	const oldList = Object.values(elm.classList);
	oldList.map(item => elm.classList.remove(item));
	cls.map(entry => elm.classList.add(entry));
}

/********************************************/
/* autoclick element if it has class and other does not */
/********************************************/
const classCheck = (e1, cls1, e2, cls2) => { 
	if (e1.classList.contains(cls1) === true && e2.classList.contains(cls2) !== true) { 
		e1.click();
	}
}

/********************************************/
/* autoclick element if it has class and other does not */
/********************************************/
const alertPanel = document.querySelector("#alert-panel");
const alertMessage = document.querySelector("#alert-message");

const sendMessage = (msgStyle, msg) => {
	alertMessage.innerText = msg;
	// alertMessage.style.cssText = msgStyle;
	alertMessage.setAttribute("style", msgStyle);
	alertPanel.classList.add('show');
	setTimeout(() => alertPanel.classList.remove('show'), 5000);
} 

/********************************************/
/* dynamically combine element components */
/********************************************/
const createTile = (...elements) => {
	const elmParent = elements[0];
	const newElm = document.createElement(elements[1]);

	elements.map((num, ix) => {
		if (elements.indexOf(num, 2) % 2 === 0) {
			switch(num) {
				case 'eText':
					const newText = document.createTextNode(elements[ix + 1]);
					newElm.appendChild(newText);
					break;
				case 'eClass':
					// newElm.classList.add(elements[ix + 1]);
					newElm.classList = elements[ix + 1];
					break;
				case 'eId':
					newElm.id = elements[ix + 1];
					break;
				case 'eSrc':
					newElm.src = elements[ix + 1];
				case 'eAlt':
					newElm.alt = elements[ix + 1];
				case 'eType':
					newElm.type = elements[ix + 1];
					break;
				case 'eName':
					newElm.name = elements[ix + 1];
					break;
				case 'eValue':
					newElm.value = elements[ix + 1];
					break;
				case 'eDisabled':
					newElm.disabled = elements[ix + 1];
					break;
				default:
					throw new Error('parameter not implemented');
			}
		}
	});
	elmParent.appendChild(newElm);

	return newElm;
}

const createEmptyTile = (referenceDiv, parentNode, classes, nodeType = "div") => { 
	const newDiv = document.createElement(nodeType);
	newDiv.classList = classes;
	const insertDiv = parentNode.insertBefore(newDiv, referenceDiv);
	setTimeout(() => parentNode.removeChild(newDiv), 512);
}
/********************************************/
/* register user */
/********************************************/
const joinEmail = document.getElementById("joinEmail");
const joinPass = document.getElementById("joinPass");
const joinConfirmPass = document.getElementById("joinConfirmPass");

const joinUser = (email = joinEmail.value, pw = joinPass.value, pw2 = joinConfirmPass.value) => {
	fetch('http://localhost:3000/join', {
		method: 'post',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			email: email.toLowerCase(),
			pw: pw,
			pw2: pw2
		})
	})
	.then(response => {
		if (response.status !== 200) {
			openMenus('select', failedJoin, failedJoin);
			setTimeout(() => openMenus('select', failedJoin, failedJoin), 5000);
			return;
		}
		response.json()
		.then(data => {
			userData.user_id = data;
			cartUserCheck();
			userData.email = email;
			// userData.cc_no = 'add payment info';
			userData.joined = new Date();
			// console.log(`userData: ${userData}, data: ${data}`);
			console.log(userData);
			console.log(`id: ${userData.user_id}, email: ${userData.email}, date: ${userData.joined}`);
			// userData = data;
			userIsLoggedIn(join, joinDiv);
			// console.log(`uDat: ${userData}, d: ${data}`)
			// openMenus('select', joinDiv, join, login, loginDiv, credsDiv, credsForm);
			switchOptions(account); 
			sendMessage(
				"color: limegreen;", 
				"Get set for your first order by updating your billing and contact information."
			);
			emailB.innerText = `${userData.email}`; 
			bidB.innerText = `BB-1218-${userData.user_id.toString().padStart(5, '0')}`; 
			boxB.innerText = `Ordered: ${new Intl.DateTimeFormat('en-US').format(userData.joined)}`; 
			// userAccount(data); 
			setInMotion([nameB, emailB, addrB]);
		})
	})
	.catch(err => console.log("Bad password"));
}
/********************************************/
/* login user */
/********************************************/
const loginEmail = document.getElementById("loginEmail");
const loginPass = document.getElementById("loginPass");
let userData = {};
console.log(userData);

const loginUser = (email = loginEmail.value, pass = loginPass.value) => {
	// sending post of input to server
	fetch('http://localhost:3000/login', {
		method: 'post',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			email: email.toLowerCase(),
			pass: pass
		})
	})
	.then(response => {
		if (response.status !== 200) {
			openMenus('select', failedLogin, failedLogin);
			setTimeout(() => openMenus('select', failedLogin, failedLogin), 5000);
			return;
		}
		response.json()
		// .then(data => console.log(data));
		.then(data => {
			// if (data === 'invalid user') {
			// 	console.log(data.id);
			// 	openMenus('select', failedLogin, failedLogin);
			// 	setTimeout(() => openMenus('select', failedLogin, failedLogin), 5000);
			// } else if (data === 'your email or password do not match'){
			// 	console.log('bad login info');
			// } else {
			// 	console.log('you are logged in');
			// 	console.log(`E: ${email}, P: ${pass}`);
			console.log(data);
			userData = data; 
			cartUserCheck();
			console.log(userData);
			userIsLoggedIn(login, loginDiv);
			if (home.classList.contains('homeLoad')
					|| home.classList.contains('lg')) { 
						switchOptions(products); 
			}
			sendMessage(
				"color: limegreen;", 
				"Welcome back! Come see what we have in stock!"
			);
			userAccount(data);
			setInMotion([nameB, emailB, addrB]);
		})
	})
	.catch(error => { console.log("Request denied"); });
}

const userIsLoggedIn = (menu, menuDiv) => {
	openMenus('select', loDiv, logoutDiv);
	if (loDiv.classList.contains('select') === true) {
		setTimeout(() => 
			// openMenus('select', menu, menuDiv, 0, 0, credsDiv, credsForm, logoutDiv), 1000
			openMenus('select', menu, menuDiv, 0, 0, credsContainer, credsForm, logoutDiv), 1000
		);
	}
	if (mobileMenuIcon.classList.contains('hide')) { 
		setTimeout(() => mobileMenuDiv.click(), 1000); 
	}
} 

const thisOrThat = (d, str1, str2) => {
	if ((str1 !== str2 && d !== 0) ? v = str1 : v = str2);
	return v;
}

const userAccount = (d) => {
	const data = [
			thisOrThat(1, `${d.first_name} ${d.last_name}`, `add your name`), 
			`${d.email}`, 
			`********`,
			thisOrThat(d.ui_statefk, `${d.street} ${d.city}, ${d.state_code} ${d.zip}`, `add your address`), 
			thisOrThat(d.exp_mo, `**${trimData(2, d.cc_no)} ${d.exp_mo}/${d.exp_yr}  ${d.card_co}`, `add payment info`),
			thisOrThat(1, `${d.phone}`, `add a phone #`), 
			`BB-1218-${d.user_id.toString().padStart(5, '0')}`, 
			`Ordered: ${d.joined.substring(5, 10)}-${d.joined.substring(0, 4)}`, 
		];
	const smPanelText = document.getElementsByClassName('sm-panel-text');
	data.map((num, idx) => { smPanelText[idx].textContent = data[idx];	});
}

const trimData = (len, data) => {
	if (data.length > len ? s = data.substring(data.length - len) : s = data);
	return s;
}

async function editAccounts(...element) { 
	await element.map(num => openMenus('select', num));
}

const scrollText = (scrollBox, contents, scrollMax) => {
	(scrollBox.scrollTop > scrollMax && contents.innerText.length > 24)
		? setTimeout(() => contents.classList.add('scroll'), 0)
		: contents.classList.remove('scroll')
}

const windowSzScrollText = (elem) => {
	(elem.getBoundingClientRect().top < 1500)
		? (elem.innerText.length > 24) 
			? setTimeout(() => elem.classList.add('scroll'), 2000)
			: elem.classList.remove('scroll')
		// : (window.innerWidth > 830) 
		// 	? setTimeout(() => elem.classList.add('scroll'), 2000)
		// 	: elem.classList.remove('scroll')
		: elem.classList.remove('scroll')
}

const setInMotion = (data) => {
	if (account.classList.contains('lg')) {
		data.map((num, idx) => windowSzScrollText(data[idx]));
	}
}

const addCursor = (elm = passC) => 	elm.select();
/********************************************/
/* edit user */
/********************************************/
const validateCC = (num) => {
	const type1 = parseInt(num, 10);
	// const type2 = Number(num);
	(type1 >= 5.1e15 && type1 < 5.6e15)
		? card_co = 'MSCD'
		: ((type1 >= 3.4e14 && type1 < 3.5e14) || (type1 >= 3.7e14 && type1 < 3.8e14))
		? card_co = 'AMEX'
		: ((type1 >= 4e12 && type1 < 5e12) || (type1 >= 4e15 && type1 < 5e15))
		? card_co = 'VISA'
		: ((type1 >= 5e14 && type1 < 6e14) || (type1 >= 6.011e15 && type1 < 7e15))
		? card_co = 'DISC'
		: ((type1 >= 3e13 && type1 < 3.06e13) 
				|| (type1 >= 3.6e13 && type1 < 3.7e13) 
				|| (type1 >= 3.8e13 && type1 < 3.9e13))
		? card_co = 'CLUB'
		: ((type1 >= 1.8e14 && type1 < 1.801e14) 
				|| (type1 >= 2.131e14 && type1 < 2.132e14) 
				|| (type1 >= 3.5e15 && type1 < 3.6e15))
		? card_co = 'JCB'
		:card_co = 'INVALID'; 
	if (validateAlg(num) > 0) { card_co = 'INVALID' };
	return card_co;
}
// check card or account validity with Luhn algorithm
const validateAlg = (card) => {
		tot = sum = 0;
		even = false;
		// for (i = card.length - 1; i >= 0; i--) {
		while (card != 0) {
			tot = card % 10;
			card = Number(parseInt(card / 10));
			if (even) {
				tot *= 2;
				if (tot > 9) {
					// tot = (tot % 10) + 1;
					tot -= 9;
				}	
			} 
			sum += tot;
			even = !even;
		}
		return sum % 10;
}

class Account {
	constructor(errMsg, invalid, rgExp, scroll, urlSrv, alpha, beta, chi, delta, epsilon, phi) {
		this.errMsg = errMsg; 
		this.invalid = invalid; 
		this.rgExp = rgExp; 
		this.scroll = scroll; 
		this.urlSrv = urlSrv; 
		this.alpha = alpha; 
		this.beta = beta; 
		this.chi = chi; 
		this.delta = delta; 
		this.epsilon = epsilon; 
		this.phi = phi; 
	}
	add() { return this.scroll.innerText = this.alpha.value; }
	check() { return (this.alpha.value === ""); }
	clear() { return this.alpha.value = ""; }
	supply() { return JSON.stringify({ id: userData.user_id, input: this.alpha.value }); }
	validate() { return this.rgExp.test(this.alpha.value); }
}

class Pass extends Account {
	constructor(errMsg, invalid, rgExp, scroll, urlSrv, alpha, beta, chi, delta, epsilon, phi) {
		super(errMsg, invalid, rgExp, scroll, urlSrv, alpha, beta, chi, delta, epsilon, phi);
	}
	add() { return this.scroll.innerText = '********'; }
}

class Address extends Account {
	constructor(errMsg, invalid, rgExp, scroll, urlSrv, alpha, beta, chi, delta, epsilon, phi) {
		super(errMsg, invalid, rgExp, scroll, urlSrv, alpha, beta, chi, delta, epsilon, phi);
	}
	add() { return this.scroll.innerText = `${this.beta.value}, ${this.alpha.value}`; }
	check() { return (this.alpha.value === "" || this.beta.value === ""); }
	clear() { return this.alpha.value = this.beta.value = ""; }
	supply() {
		return JSON.stringify({ id: userData.user_id, cities: this.alpha.value, street: this.beta.value })
	}
	validate() { return this.rgExp.test(this.beta.value); }
}

class Pay extends Account {
	constructor(errMsg, invalid, rgExp, scroll, urlSrv, alpha, beta, chi, delta, epsilon, phi) {
		super(errMsg, invalid, rgExp, scroll, urlSrv, alpha, beta, chi, delta, epsilon, phi);
	}
	add() { 
		return this.scroll.innerText 
		=`**${trimData(2, this.alpha.value)} ${this.beta.value}/${this.chi.value} ${card_co}`; 
	}
	clear() { 
		this.alpha.value = this.delta.value = ""; 
		this.beta.value = this.chi.value = 0;
		return;
	}
	supply() { 
		console.log('supply');
		return JSON.stringify({ 
			id: userData.user_id, 
			cc_no: this.alpha.value, 
			exp_mo: this.beta.value, 
			exp_yr: this.chi.value, 
			sec_no: this.delta.value, 
			card_co: validateCC(this.alpha.value) 
		}); }
	validate() { 
		let valid = false;
		(validateCC(this.alpha.value) === 'INVALID' || this.delta.value.length !== 3)
			? valid = false
			: valid = true; 
		return valid;
	}
}
// RegEx source: https://www.regextester.com/96605
const nameUser = new Account(
		"Bad name", 
		"Please enter your full name.", 
		new RegExp(/\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\s/), 
		nameB, 
		"http://localhost:3000/name", 
		nameC, 
	);
//RegEx source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
const emailUser = new Account(
		'Bad email', 
		'Please use a proper email address.', 
		new RegExp(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/), 
		emailB, 
		'http://localhost:3000/email', 
		emailC, 
	);
// RegEx source: https://www.w3resource.com/javascript/form/password-validation.php
const passUser = new Pass(
		'Bad password', 
		'Password must use 8-30 symbols, numbers, and letters (upper and lowercase).', 
		new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,30}$/), 
		passB, 
		'http://localhost:3000/pass', 
		passC, 
	);
// RegEx source: https://www.regextester.com/93592
const addrUser = new Address(
		'Bad address', 
		'We could not locate your address. Please try again.',
		// new RegExp(/^\d+\s[A-z]+\s[A-z]+/),
		new RegExp(/^\d+\s[A-z]+\s[A-z]|\d+\s[A-z]+|\s[A-z]+/),
		addrB,
		'http://localhost:3000/address',
		addrC,	//alpha	- cities
		addrE,	//beta - street
	);
const payUser = new Pay (
		"Bad card information", 
		"Card invalid. Please try again.", 
		new RegExp(/<(|\/|[^\/>][^>]+|\/[^>][^>]+)>/), 
		payB, //score - card
		"http://localhost:3000/pay", 
		payC, //alpha - num
		payE, //beta - mo
		payF, //chi - yr
		payG, //delta - sec
	);
//RegExp source: https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number
const phoneUser = new Account(
		"Bad phone number", 
		"Please enter a 10-digit phone number such as: 123-456-7890.", 
		new RegExp(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/), 
		phoneB, 
		"http://localhost:3000/phone", 
		phoneC, 
	);

const editInput = (user = userAddr) => {
	if (user.check()) { 
		return sendMessage("color: orangered;", "Please enter some information.");
	}
	
	if (!user.validate()) {
		user.clear(); 
		return sendMessage(
				"color: orangered;", 
				user.invalid
			);
	}
	fetch(user.urlSrv, {
		method: 'put',
		headers: {'Content-Type': 'application/json'},
		body: user.supply()
	})
	.then(response => {
		if (response.status !== 200) {
			user.clear();
			return sendMessage(
					"color: orangered;",
					"There is a conflict with your information. Please try again."
				);
		}
		response.json()
		.then(data => { 
			sendMessage("color: limegreen;", "Your info has been saved!");
			user.add();
			user.clear(); 
			if (user.scroll.innerText.length > 24) 
				setTimeout(() => user.scroll.classList.add('scroll'), 2000); 
			return;
		})
	})
	.catch(err => console.log(user.errMsg));
}
/********************************************/
/* load products */
/********************************************/

// ********loading screen needs work*********
let showProductsPanel = false;

const productsLoader = () => { 
	const loadProductsPanel = document.querySelector("#load-products-panel");

	if (!showProductsPanel) {
		addClasses('show', loadProductsPanel);
		setTimeout(() => rmClasses('show', loadProductsPanel), 3000);
		showProductsPanel = true;
	}
	return;
}
// ********loading screen needs work*********

const getProds = () => { 
	// if (spicy !== undefined || spicy.length !== 0) {
	// 	console.log('spicy');
	// 	printProds(spicy);
	// 	boolProds = true;
	// } else {
	// 	fetch("http://localhost:3000/spicy")
	// // ********productsLoader needs work*********
	// 	.then(productsLoader())
	// 	.then(response => response.json())
	// 	.then(resolve => {

			if (!boolProds) { 
				// printProds(resolve);
				printProds(spicy);
				boolProds = true;
				productsLoader();
				// addProdsEvents(resolve);
			} else {
				return;
			}
	// 	});
	// }
}

const scrollProducts = document.querySelector("#scroll-products");
let boolProds = false;

const printProds = (prodArObj) => {
	prodArObj.map((spice) => {
		console.log(spice.name);

		const newDiv1 = createTile(
			scrollProducts, 'div', 'eClass', 'panel-container');

		const newH1 = createTile(
			newDiv1, 'h1', 'eText', spice.name, 'eClass', 'abs-pos panel-title');
		
		const newImg = createTile(
				newDiv1, 'img', 
				'eClass', 'panel-img', 
				'eId', spice.imgId, 
				'eSrc', spice.img, 
				'eAlt', spice.name
			);

		const newDiv2 = createTile(newDiv1, 'div', 'eClass', 'abs-pos panel-header');

		const newP1 = createTile(
				newDiv2, 'p',
				'eText', '2 oz.',
				'eClass', 'panel-p',
				'eClass', 'weight-p'
			);

		const newP2 = createTile(
				newDiv2, 'p', 
				'eText', spice.cost,
				'eClass', 'panel-p',
				'eClass', 'cost-p'
			);

		const newDiv3 = createTile(newDiv1, 'div', 'eClass', 'panel-info');

		const newP3 = createTile(
				newDiv3, 'span', 'eText', 'Source: ', 'eClass', 'panel-p');
		const newSpan = createTile(
				newP3, 'span', 'eText', spice.latin, 'eClass', 'span-p');
		const afterP3 = createTile(
				newP3, 'p', 'eText', spice.pSource, 'eClass', 'panel-p');

		// const newP3 = document.createElement("p");
		// const newSpan = document.createElement("span");
		// const postSource = document.createTextNode("Source: ");
		// const postLatin = document.createTextNode(spice.latin);
		// const postSourceInfo = document.createTextNode(spice.pSource);
		// newP3.classList = "panel-p";
		// newSpan.classList = "span-p";
		// newSpan.appendChild(postLatin);
		// newP3.appendChild(postSource);
		// newP3.appendChild(newSpan);
		// newP3.appendChild(postSourceInfo);
		// newDiv3.appendChild(newP3);

		const newP4 = createTile(
				newDiv3, 'p', 'eText', spice.pColor, 'eClass', 'panel-p');

		const newP5 = createTile(
				newDiv3, 'p', 'eText', spice.pFlavor, 'eClass', 'panel-p');

		const newP6 = createTile(
				newDiv3, 'p', 'eText', spice.pUses, 'eClass', 'panel-p');

		const newDiv4 = createTile(newDiv1, 'div', 'eClass', 'panel-form');

		const newBtn1 = createTile(
				newDiv4, 'button', 
				'eText', '-',
				'eClass', 'form-btn add-sub sub-btn',
				'eId', spice.subId
			);

		const newInput1 = createTile(
				newDiv4, 'input',
				// 'eText', spice.amtId,
				'eText', spice.id,
				// 'eClass', 'form-btn',
				// 'eClass', 'input-amt',
				'eClass', 'form-btn input-amt',
				'eId', spice.amtId,
				'eName', spice.amtId,
				'eValue', '0',
				'eDisabled', 'disabled',
			);

		const newBtn2 = createTile(
				newDiv4, 'button',
				'eText', '+',
				'eClass', 'form-btn add-sub add-btn',
				'eId', spice.addId
			);

		const newDiv5 = createTile(newDiv4, 'div');

		// const newInput2 = createTile(
		// 		newDiv5, 'input',
		// 		'eClass', 'form-btn',
		// 		'eId', spice.savId,
		// 		'eType', 'submit',
		// 		'eName', spice.savId,
		// 		'eValue', 'Save'
		// 	);

		const newInput3 = createTile(
				newDiv5, 'input',
				'eClass', 'form-btn',
				'eId', spice.buyId,
				'eType', 'submit',
				'eName', spice.buyId,
				'eValue', 'Add to Bag'
			);

		newBtn1.addEventListener("click", subProduct);
		newBtn2.addEventListener("click", addProduct);
		// newInput2.addEventListener("click", saveProduct);
		newInput3.addEventListener("click", addToCart);
	});
}

const scrollToTop = (element) => {
	element.scrollTo(0,0);
}

const scrollToLeft = (element) => {
	for(i = 0; i < 500; i++)
		setTimeout(() => element.scrollTo(i, 0), 1000);
}

/********************************************/
/* update products in cart */
/********************************************/
let shoppingList = [];
const subBtn = document.getElementsByClassName("sub-btn");
const addBtn = document.getElementsByClassName("add-btn");
const cart = document.getElementById("cart");
const smPanel = document.querySelectorAll(".sm-panel");
const scrollShopping = document.getElementById('scroll-shopping');
const shoppingBag = document.getElementById("shopping-bag");
const itemsInCart = document.getElementById("cart-amt");

const review = document.querySelector("#review"); 
const reviewSpan = document.querySelectorAll(".review-span"); 
const totSpan = document.querySelector("#tot-span");
const reviewCheckout = document.getElementById("review-checkout"); 
const reviewJoin = document.getElementById("review-join"); 
const reviewLogin = document.getElementById("review-login"); 

const scrollOrders = document.querySelector("#scroll-orders");

const subProduct = (event) => {
	let amount = event.target.nextElementSibling;
	if (amount.value > 0) {
		amount.value--; 
	}
}

const addProduct = (event) => { 
	let amount = event.target.previousElementSibling;
	if (amount.value < 10) 
		amount.value++;
}

const saveProduct = (event) => {
	console.log(`Saved: ${event.target.id}`);
	// button changes to remove or saved?
}

let alertMsg = true;

const cartUserCheck = () => {
	if (Object.entries(userData).length === 0 && userData.constructor === Object) {
		if (alertMsg) {
			alertMsg = false; 
			sendMessage(
					"color: orangered;", 
					"Please register or login to complete your order."
				);
		}
		if (reviewJoin.classList.contains('show') === false) {
			openMenus('show', reviewJoin, reviewLogin, reviewCheckout); 
		} 
	} else {
		if (reviewCheckout.classList.contains('show') === false) {
			openMenus('show', reviewCheckout, reviewCheckout, reviewJoin, reviewLogin); 
		}
	}
}

const printCart = (cartArObj, items, image) => {
	console.log('items: ', items);
		const newDiv1 = createTile(
				scrollShopping, 'div', 
				'eClass', 'panel-container sm-panel buy-items',
				'eId', cartArObj.product
			);
		const newDiv2 = createTile(newDiv1, 'div', 'eClass', 'shopping1');
		const newImg1 = createTile(
				newDiv2, 'img', 'eClass', 'shopping-img', 'eSrc', image);
		const newP1 = createTile(
				newDiv2, 'p', 'eText', '2 oz.', 'eClass', 'abs-pos shopping-wgt');

		const newDiv3 = createTile(newDiv1, 'div', 'eClass', 'shopping2');
		const newH1 = createTile(
				newDiv3, 'h1', 'eClass', 'shopping-txt item-price', 'eText', '$');
		const newH2 = createTile(
				newDiv3, 'h1', 
				'eClass', 'shopping-txt item-price item-sum', 
				'eText', (cartArObj.price * items).toFixed(2)
			);
		// const newP2 = createTile(
		// 	newDiv3, 'p', 'eClass', 'shopping-txt in-bag', 'eText', ' in bag');
		const newSpan1 = createTile(
				newDiv3, 'span', 'eClass', 'shopping-span shopping-txt in-bag');
		const input1 = createTile(
				newSpan1, 'input', 
				'eClass', 'shopping-num in-bag item-count', 
				'eType', 'number', 
				'eName', cartArObj.product, 
				'eValue', items,
				'eDisabled', 'disabled'
			);
		const newP2 = createTile(
				newSpan1, 'p', 'eClass', 'shopping-txt in-bag', 'eText', ' in bag');

		const newSpan2 = createTile(
				newDiv3, 'span', 'eClass', 'shopping-span shopping-txt in-stock');
		const input2 = createTile(
				newSpan2, 'input', 
				'eClass', 'shopping-num in-stock stock-count', 
				'eType', 'number', 
				'eName', cartArObj.product, 
				'eValue', cartArObj.inventory,
				'eDisabled', 'disabled'
			);
		const newP3 = createTile(
				newSpan2, 'p', 'eClass', 'shopping-txt in-stock', 'eText', ' in stock');

		const newDiv4 = createTile(newDiv1, 'div', 'eClass', 'shopping3');
		const newH3 = createTile(
			newDiv4, 'h1', 'eClass', 'panel-title shopping-head', 'eText', cartArObj.product);

		const newBtn1 = createTile(newDiv1, 'button', 'eClass', 'abs-pos sm-btn in-trash');
		const newImg2 = createTile(
				newBtn1, 'img', 
				'eClass', 'sm-btn-img trash-img',
				'eSrc', '../images/trash-moc-32-iconsdb.png',
				'eAlt', 'remove item',
				'eValue', cartArObj.prod_id
			);

		newBtn1.addEventListener("click", deleteFromCart);
}

const ticker = (current, target, term) => {
	let cVal = Math.round(Number(current.innerText)*100);
	let tVal = Math.round(Number(target*100));
	// console.log(cVal);
	if (cVal < tVal) {
		for (i = cVal; i < tVal; i++) {
			if (cVal < tVal) {
				let uptick = (tick) => {
					setTimeout(() => {
						cVal++;
						current.innerText = (cVal / 100).toFixed(2);
					}, tick * term);
				}
				uptick(i);
				// console.log(current.innerText);
			}
		}
	} else {
		for (i = cVal; i > tVal; i--) {
			if (cVal > tVal) {
				let downtick = (tick) => {
					setTimeout(() => {
						cVal--;
						current.innerText = (cVal / 100).toFixed(2);
					}, tick * term);
				}
				downtick(i);
			}
		}
	}
} 

const cartSum = (sum, elm) => {
	const iSum = Object.values(sum).reduce((acc, val) => {
		return acc + Number(val.innerText);
	}, 0).toFixed(2);	

	if (Number(iSum) <= 0
		? addClasses('empty', cart, shoppingBag, review)
		: rmClasses('empty', cart, shoppingBag, review));

	const iTax = Number(iSum * 0.065).toFixed(2);
	if (iSum < 50) {
		elm[1].innerText = ship = 6.99;
	} else {
		elm[1].innerText = "Free";
		ship = 0;
	}

	const subT = Number(iSum) + Number(iTax);
	if (subT <= 0) {
		elm[1].innerText = ship = "0.00";
	}
	const iTot = (subT + Number(ship)).toFixed(2);

	ticker(elm[0], Number(iSum), 0.2); 
	ticker(elm[2], Number(iTax), 3.6); 
	ticker(elm[3], Number(iTot), 0.2); 
}

const chkInventory = (id, itemAmount, imgSrc) => {
	const items = itemAmount.value;/******/ 
	itemIdx = 0;
	const itemCount = document.querySelectorAll(".item-count");
	const stockCount = document.querySelectorAll(".stock-count");
	const itemSum = document.getElementsByClassName("item-sum"); 

	fetch('http://localhost:3000/addcart', {
		method: 'put',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({ id, itemAmount: itemAmount.value })
	})
	.then(response => {
		if (response.status !== 200) {
			openMenus('select', failedJoin, failedJoin);
			setTimeout(() => openMenus('select', failedJoin, failedJoin), 5000);
			return;
		}
		response.json()
		.then(data => { 
			const cartBool = shoppingList.some((num, idx) => {
				itemIdx = idx;
				return num.prod_id === Number(id);
			});

			if (!cartBool) {
				data.amt = Number(items);/******/
				shoppingList.push(data);
				// console.log(shoppingList);
				printCart(data, items, imgSrc);
			} else { 
				// console.log('itemcount: ', itemCount[itemIdx].value);
				data.amt = Number(items) + shoppingList[itemIdx].amt;
				itemCount[itemIdx].value = shoppingList[itemIdx].amt = data.amt;/******/ 
				stockCount[itemIdx].value = data.inventory;
				itemSum[itemIdx].innerText = (data.price * data.amt).toFixed(2);
			}
			cartSum(itemSum, reviewSpan);
		})
	})
	.catch(err => console.log("Out of Stock"));
} 

const addToCart = (event) => {
	const itemAmount = event.target.parentElement.previousSibling.previousSibling; 
	const itemAdded = itemAmount.textContent; 
	const panelImg = document.querySelectorAll(".panel-img"); 

	shoppingList.map(list => {
		// console.log(Number(itemAdded), list.prod_id); 
		if (Number(itemAdded) === list.prod_id) { 
			check = list.amt + Number(itemAmount.value); 
			if (check >= 10) { 
				itemAmount.value = 10 - list.amt; /******/
				// list.amt += Number(itemAmount.value); /******/ 
				// alert("You may only add 10 of each item per order."); 
				sendMessage(
					"color: orangered;", 
					"Sorry, your shopping bag can only hold 10 of this item."
				);
			}
		}
	});
	
	if (itemAmount.value > 0 && itemsInCart.value < 99) {
		const cartTot = Number(itemsInCart.value) + Number(itemAmount.value); 

		chkInventory(itemAdded, itemAmount, panelImg[itemAdded - 1].src); 

		for (items = 0; items < itemAmount.value; items++) {
			if (itemsInCart.value < cartTot) {
				let bagItems = (placeItem) => {
					setTimeout(() => {
						itemsInCart.value = Number(itemsInCart.value) + 1;
					}, placeItem*200);
				};
				bagItems(items);
			}
		}
		cart.classList.add('show');
		itemAmount.value = 0;
	}
	console.log(shoppingList);
}

const deleteFromCart = (event, list) => {
	const itemSum = document.getElementsByClassName("item-sum"); 

	const listItem = [
		{
			cost: event.target.parentElement.previousSibling.previousSibling.children[1].innerText,
			amt: event.target.parentElement.previousSibling.previousSibling.children[2].firstChild.value,
			inventory: event.target.parentElement.previousSibling.previousSibling.children[3].firstChild.value,
			prod_id: event.target.value,
			product: event.target.parentNode.parentNode,
			element: event.target.parentNode.parentNode.parentNode,
		},
	];
	console.log(listItem);

	if (!list) { list = listItem; } 
	list.map(item => { 
		// console.log(item); 
		fetch('http://localhost:3000/deletecart', {
			method: 'put',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ id: item.prod_id, amt: item.amt })
		})
		.then(response => {
			if (response.status !== 200) {
				// openMenus('select', failedJoin, failedJoin);
				// setTimeout(() => openMenus('select', failedJoin, failedJoin), 5000);
				return;
			}
			response.json()
			.then(data => { 
				const emptyNode = createEmptyTile(item.product, scrollShopping, "panel-container sm-panel panel-shrink");
				const deleted = item.element.removeChild(item.product);
				shoppingList.map((item, idx) => {
					if (item.prod_id === data.prod_id) { 
						shoppingList.splice(idx, 1);
					}
					return;
				});

				for (items = item.amt; items > 0; items--) { 
						let unbagItems = (placeItem) => {
							setTimeout(() => {
								itemsInCart.value = Number(itemsInCart.value) - 1;
							}, placeItem*200);
						};
						unbagItems(items); 
				}
				cartSum(itemSum, reviewSpan); 
			})
		})
		.catch(err => console.log("Removal error.")); 
	});
}

const placeOrder = () =>  {
	if (totSpan.innerText === "0.00") {
		sendMessage(
				"color: orangered;", 
				"Please add an item to your shopping bag before checking out."
			);
		switchOptions(products);
		cart.click();
	} else {
		sendMessage(
					"color: limegreen;", 
					"Your order is complete! We will send you an email with your order details shortly."
				);
		const orderTotals = {
			subtotal: Number(reviewSpan[0].innerText),
			getShipping: function() {
				const value = Number(reviewSpan[1].innerText);
				let ship = 0;
				if (!isNaN(value)) { ship = value; }
				return ship;
			},
			tax: Number(reviewSpan[2].innerText),
			total: Number(reviewSpan[3].innerText),
		} 
		orderTotals.shipping = orderTotals.getShipping();

		fetch('http://localhost:3000/placeorder', {
			method: 'post', 
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ 
					id: userData.user_id, 
					ship: orderTotals.shipping,
					tax: orderTotals.tax,
					tot: orderTotals.total
				})
		})
		.then(response => {
			if (response.status !== 200) {
				// openMenus('select', failedJoin, failedJoin);
				// setTimeout(() => openMenus('select', failedJoin, failedJoin), 5000);
				return;
			}
			response.json()
			.then(order => {
				storeOrder(order);
				userData.order_id = order;
			})
			.catch(err => console.log("Order failed. Check order details."))
		});
	}
}

const storeOrder = (order_id) => {
	const buyItems = document.querySelectorAll(".buy-items");
	const reviewSpan = document.querySelectorAll(".review-span");

	fetch('http://localhost:3000/storeorder', {
		method: 'post',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
				order: order_id,
				list: shoppingList
			})
	})
	.then(response => {
		if (response.status !== 200) {
			// openMenus('select', failedJoin, failedJoin);
	 		// setTimeout(() => openMenus('select', failedJoin, failedJoin), 5000);
			return;
		}
		response.json()
		.then(order => {
			console.log('Order BB-0205-' + order + ' complete!');
			Object.values(buyItems).map(list => scrollShopping.removeChild(list));
			// ******Needs work******
			const zero = 0
			for (i = 0; i < reviewSpan.length; i++) {
				reviewSpan[i].innerText = zero.toFixed(2);
			}
			itemsInCart.value = zero;

			shoppingList.length = 0;
			cart.click();
			console.log(userData);
			console.log(shoppingList);
		})
		.catch(err => console.log("Failed to store order details."))
	});
}

let showOrdersPanel = false;

const loadOrders = () => { 
	const ordersMsg = document.querySelector("#orders-msg");
	const loadOrdersPanel = document.querySelector("#load-orders-panel");
	if (Object.entries(userData).length === 0 && userData.constructor === Object) { 
// if (userData.user_id === 0) {
			showOrdersPanel = false; 
			return addClasses('show', ordersMsg);
	} 

	if (showOrdersPanel === false) {
		showOrdersPanel = true; 
		rmClasses('show', ordersMsg);
		addClasses('show', loadOrdersPanel);
		setTimeout(() => rmClasses('show', loadOrdersPanel), 3000);
	}

	fetch('http://localhost:3000/loadorders', {
		method: 'put',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			id: userData.user_id
		})
	})
	.then(response => {
		if (response.status !== 200) {
			return;
		}
		response.json()
		.then(orders => {
			displayOrders(orders);
			userData.orders = orders;
			console.log(orders);
		})
	})
	console.log(userData);
} 

let ordersLoaded = false;
let spicy = [];

fetch("http://localhost:3000/spicy") 
		.then(response => response.json())
		.then(resolve => spicy = resolve)
		.catch(err => console.log("Failed to access images."));

const displayOrders = (ordersList) => {
	if (!ordersLoaded) {
		ordersLoaded = true;
		let orderId = 0; 
		let savedDiv = 0;
		const orderCount = ordersList.length;

		ordersList.map((item, idx) => {
			if (orderId !== item.order_id) {
				const newDiv1 = createTile(
						scrollOrders, 'div', 'eClass', 'orders-container');

				const newIdDiv = createTile(newDiv1, 'div', 'eClass', 'oitem-iddiv');
				const newIdHead1 = createTile(
						newIdDiv, 'h2', 'eClass', 'oitem-orderid', 'eText', 'Order: ');
				const newIdHead2 = createTile(
						newIdDiv, 'h2', 
						'eClass', 'oitem-orderid', 
						'eText', 'BB-1900-' + item.order_id.toString().padStart(4, '0'));
				
				const newDiv2 = createTile(newDiv1, 'div', 'eClass', 'oitem-bar4');
				const newDiv3 = createTile(newDiv1, 'div', 'eClass', 'tag-txt tag-calc');
				
				const newHead1 = createTile(
						newDiv3, 'h3', 'eClass', 
						'oitem-cart tag-p tag-sub', 
						'eText', 'subtotal: $' 
						+ (Number(item.tot) - (Number(item.ship) + Number(item.tax))).toFixed(2)
					); 
				
				const newHead2 = createTile(
						newDiv3, 'h4', 
						'eClass', 'oitem-cart tag-p', 
						'eText', 'ship: ' + item.ship
					); 	
				
				const newHead3 = createTile(
						newDiv3, 'h4', 
						'eClass', 'oitem-cart tag-p', 
						'eText', 'tax: ' + item.tax
					); 

				const newHead4 = createTile(
						newDiv3, 'h2', 
						'eClass', 'oitem-cart tag-p tag-tot',
						'eText', '$' + item.tot
					); 
				savedDiv = newDiv1;
				orderId = item.order_id;
			} 

			const newDiv4 = createTile(savedDiv, 'div', 'eClass', 'oitem-div');

			let image = 0;

			spicy.some(spice => {
				image = spice.thumb;
				return spice.name === item.product;
			}); 

			const newImg1 = createTile(
					newDiv4, 'img', 'eClass', 'oitem-img', 'eSrc', image);

			const newDiv5 = createTile(newDiv4, 'div', 'eClass', 'abs-pos oitem-bar1');
			const newDiv6 = createTile(newDiv4, 'div', 'eClass', 'abs-pos oitem-bar2');
			const newDiv7 = createTile(newDiv4, 'div', 'eClass', 'abs-pos oitem-bar3');
			
			const newHead5 = createTile(
					newDiv4, 'h4', 
					'eClass', 'abs-pos oitems oitem-name',
					'eText', item.product
				);

			const newHead6 = createTile(
					newDiv4, 'h5',
					'eClass', 'abs-pos oitems oitem-price',
					'eText', '$' + (Number(item.prod_price) * item.qty).toFixed(2)
				); 

			const newHead7 = createTile(
					newDiv4, 'h4', 'eClass', 'abs-pos oitems oitem-qty', 'eText', 'Qty. ');
			const newHead8 = createTile(
					newDiv4, 'h4', 'eClass', 'abs-pos oitems oitem-num', 'eText', item.qty);

			if (ordersList[idx + 1] !== undefined 
					&& ordersList[idx + 1].order_id !== item.order_id
					|| idx === orderCount - 1) { 
				const newDiv8 = createTile(savedDiv, 'div', 'eClass', 'oitem-bar4');
			} 
		}); 
	}
}

/********************************************/
/* menu selector arrows */
/********************************************/
const select = (element) => {
	element.classList.toggle('select');
}

/********************************************/
/* clicking menu selector arrows resizes options */
/********************************************/
const arrowContainer = document.getElementById("arrow-container");
const arrowDiv = document.getElementById("arrow-div");
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");
const mobileMenuDiv = document.getElementById("mobile-menu-div");
const mobileMenuIcon = document.getElementById("mobile-menu-icon");

const options = [home, products, orders, account, about];
let selected = 0;
select(options[selected]);

// hidden at load, cycles menu options to the left
const cycleLeft = () => {
	// displays right arrow on load
	rightArrow.classList.remove('display');
	// run if not at start of menu array, highlights prev menu item
	if (selected > 0) {
		selected--;
	}
	return switchOptions(options[selected]);
	// return select(options[selected]);
}

// visible at load, cycles menu options to the right
const cycleRight = () => {
	// hides left arrow on load
	leftArrow.classList.add('display');
	// run if not at end of menu array, highlights next menu item
	if (selected < (options.length - 1)) {
		selected++;
	}
	return switchOptions(options[selected]);
}

const switchOptions = (page) => {
	const panels = document.getElementsByClassName('panels');
	// when called clear extra home formatting
	home.classList.remove('homeLoad');
	// when called display arrows by default
	leftArrow.classList.add('display');
	rightArrow.classList.remove('display');
	// when called removes formatting that was used when last called
	for (let i = options.length - 1; i >= 0; i--) {
		options[i].classList.remove('lg');
		options[i].classList.remove('md');
	}
	
	if (page != products) { scrollToTop(scrollProducts); }

	// display specific formatting based on case
	switch(page) {
		case home:
			home.classList.add('lg');
			products.classList.add('md'); 
			leftArrow.classList.remove('display');
			// addClasses('home', opOverflow);
			// rmClasses('products', opOverflow);
			setupClassList(opOverflow, 'abs-pos', 'home');
			Object.values(panels).map(num => num.classList.remove('show'));
			selected = 0;
			break;
		case products:
			home.classList.add('md');
			products.classList.add('lg');
			orders.classList.add('md'); 
			// addClasses('products', opOverflow);
			// rmClasses('home', opOverflow);
			// rmClasses('orders', opOverflow);
			setupClassList(opOverflow, 'abs-pos', 'products');
			Object.values(panels).map(num => num.classList.remove('show'));
			panels[0].classList.add('show');
			getProds();
			selected = 1;
			break;
		case orders:
			products.classList.add('md');
			orders.classList.add('lg');
			account.classList.add('md'); 
			setupClassList(opOverflow, 'abs-pos', 'orders');
			Object.values(panels).map(num => num.classList.remove('show'));
			panels[1].classList.add('show');
			loadOrders();
			selected = 2;
			break;
		case account:
			products.classList.remove('productsLoad');
			orders.classList.add('md');
			account.classList.add('lg');
			about.classList.add('md'); 
			setupClassList(opOverflow, 'abs-pos', 'account');
			Object.values(panels).map(num => num.classList.remove('show'));
			panels[2].classList.add('show');
			selected = 3;
			break;
		case about:
			products.classList.remove('productsLoad');
			account.classList.add('md');
			about.classList.add('lg'); 
			rightArrow.classList.add('display');
			setupClassList(opOverflow, 'abs-pos', 'about');
			Object.values(panels).map(num => num.classList.remove('show'));
			panels[3].classList.add('show');
			selected = 4;
			break;
	}
}

// eventToVar
const stringToVar = (word, cut = 0, str = "") => {
	word = word.substring(0, word.length - cut) + str;
	return Function('"user strict";return (' + word + ')')();
}

const credsContainer = document.getElementById('creds-container');
const opContainer = document.getElementById('op-container');
const opOverflow = document.getElementById('op-overflow');

const productsPanel = document.getElementById('products-panel');
const ordersPanel = document.getElementById('orders-panel');
const opEvents = document.getElementsByClassName('op-events');
const scrollAccount = document.getElementById('scroll-account');

const nameX = document.getElementsByClassName('nameX');
const emailX = document.getElementsByClassName('emailX');
const passX = document.getElementsByClassName('passX');
const addrX = document.getElementsByClassName('addrX');
const payX = document.getElementsByClassName('payX');
const phoneX = document.getElementsByClassName('phoneX');

const addrY = document.getElementsByClassName('addrY');
const payY = document.getElementsByClassName('payY');

const nameZ = document.getElementsByClassName('nameZ');
const emailZ = document.getElementsByClassName('emailZ');
const passZ = document.getElementsByClassName('passZ');
const addrZ = document.getElementsByClassName('addrZ');
const payZ = document.getElementsByClassName('payZ');
const phoneZ = document.getElementsByClassName('phoneZ');

// nameD1.addEventListener("click", function() {
// 	editAccounts(this, ...nameX);
// 	addCursor(nameC);
// })
// emailD1.addEventListener("click", function() {
// 	editAccounts(this, ...emailX);
// 	addCursor(emailC);
// })
// passD1.addEventListener("click", function() {
// 	editAccounts(this, ...passX);
// 	addCursor(passC);
// })
// addrD1.addEventListener("click", function() {
// 	editAccounts(this, ...addrX);
// 	addCursor(addrC);
// })
// payD1.addEventListener("click", function() {
// 	editAccounts(this, ...payX); 
// })
// phoneD1.addEventListener("click", function() {
// 	editAccounts(this, ...phoneX);
// 	addCursor(phoneC);
// })
const editClick = document.getElementsByClassName('editClick');
const fwdClick = document.getElementsByClassName('fwdClick');
const saveClick = document.getElementsByClassName('saveClick');

const mobileMenuCheck = () => {
	if (mobileMenuIcon.classList.contains('hide') 
		&& (joinDiv.classList.contains('select')
		|| loginDiv.classList.contains('select')
		|| logoutDiv.classList.contains('select')
	)) { 
		// rmClasses('hide', credsDiv); 
		rmClasses('hide', credsContainer);
	} else {
		// addClasses('hide', credsDiv);
		addClasses('hide', credsContainer);
	}
}

// source: https://www.creativebloq.com/html5/12-html5-tricks-mobile-81412803
window.addEventListener("load", function() { window.scrollTo(0, 0); });
document.addEventListener("touchmove", function(e) { e.preventDefault() });

// var body = document.documentElement;
// if (body.requestFullscreen) {
//   body.requestFullscreen();
// } else if (body.webkitrequestFullscreen) {
//   body.webkitrequestFullscreen();
// } else if (body.mozrequestFullscreen) {
//   body.mozrequestFullscreen();
// } else if (body.msrequestFullscreen) {
//   body.msrequestFullscreen();
// }
// ************************************************************************

join.addEventListener("click", function() { 
	classCheck(cart, 'open', join, 'select');	
	// openMenus('select', this, joinDiv, login, loginDiv, credsDiv, credsForm);
		openMenus('select', this, joinDiv, login, loginDiv, credsContainer, credsForm);
	addCursor(joinEmail);
	// window.scrollTo(4000,0);
	mobileMenuCheck();
	setTimeout(function() {
		const wBox = joinForm.getBoundingClientRect();
		console.log(wBox.top, wBox.right, wBox.bottom, wBox.left);
		window.scrollTo(0, wBox.top);
	}, 600);
 });
login.addEventListener("click", function() { 
	classCheck(cart, 'open', login, 'select');	
	// openMenus('select', this, loginDiv, join, joinDiv, credsDiv, credsForm);
	openMenus('select', this, loginDiv, join, joinDiv, credsContainer, credsForm);
	addCursor(loginEmail);
	mobileMenuCheck();
 });
logout.addEventListener("click", function() { 
	// openMenus('select', login, loginDiv, join, joinDiv, credsDiv, credsForm, logoutDiv);
	openMenus('select', login, loginDiv, join, joinDiv, credsContainer, credsForm, logoutDiv);
	mobileMenuCheck();	
	classCheck(cart, 'open', logout, 'select');	
});

joinBtn.addEventListener("click", function() { joinUser(); });
loginBtn.addEventListener("click", function() { loginUser(); });
logoutBtn.addEventListener("click", function() { loginUser(); });
cart.addEventListener("click", function() { 
	if (totSpan.innerText === "0.00") { 
		classCheck(join, 'select', cart, 'empty');	
		classCheck(login, 'select', cart, 'empty');	
		classCheck(logout, 'select', cart, 'empty');	
		if (cart.classList.contains('open')) {
			rmClasses('open', cart, shoppingBag);
			rmClasses('empty', cart, shoppingBag, review);
		} else {
			addClasses('open', cart, shoppingBag, review);
			addClasses('empty', cart, shoppingBag, review);
		}
	} else { 
		classCheck(join, 'select', cart, 'open');
		classCheck(login, 'select', cart, 'open');
		classCheck(logout, 'select', cart, 'open');
		openMenus('open', this, shoppingBag, 0, 0, review); 
		rmClasses('empty', cart, shoppingBag, review);
	} 
	cartUserCheck(); 
});
scrollAccount.addEventListener("scroll", function() { scrollText(this, addrB, 99); });

reviewJoin.addEventListener("click", function() { 
	// openMenus('open', cart, shoppingBag, 0, 0, review);
	cart.click();
	// openMenus('select', join, joinDiv, login, loginDiv, credsDiv, credsForm); 
	openMenus('select', join, joinDiv, login, loginDiv, credsContainer, credsForm); 
	addCursor(joinEmail); 
});
reviewLogin.addEventListener("click", function() {
	// openMenus('open', cart, shoppingBag, 0, 0, review);
	cart.click();
	// openMenus('select', login, loginDiv, join, joinDiv, credsDiv, credsForm); 
	openMenus('select', login, loginDiv, join, joinDiv, credsContainer, credsForm);
	addCursor(loginEmail);
});
reviewCheckout.addEventListener("click", function() {
	placeOrder();
	// storeOrder();
	// emptyCart();
});

Object.values(editClick).map((dat, idx) => {
		dat.addEventListener("click", function() { 
			if (Object.entries(userData).length === 0 && userData.constructor === Object) {
				sendMessage(
						"color: orangered;", 
						"Please login to update your info."
					);
			} else {
				editAccounts(this, ...stringToVar(this.id.toString(), 2, 'X'));
				addCursor(stringToVar(this.id.toString(), 2, 'C'));
			}
		});
});

Object.values(fwdClick).map((dat, idx) => {
	dat.addEventListener("click", function() {
		eventC = stringToVar(this.id.toString(), 2, 'C');
		editAccounts(this, ...stringToVar(this.id.toString(), 2, 'Y'));
		if (idx < 1 ? addCursor(stringToVar(this.id.toString(), 2, 'E')) : addCursor(eventC));
	});
});

Object.values(saveClick).map((dat, idx) => {
	dat.addEventListener("click", function() {
		editAccounts(this, ...stringToVar(this.id.toString(), 2, 'Z'));
		// addCursor(stringToVar(this.id.toString(), 2, 'C'));
		editInput(stringToVar(this.id.toString(), 2, 'User')); 
	});
});

leftArrow.addEventListener("click", cycleLeft);
rightArrow.addEventListener("click", cycleRight);

mobileMenuDiv.addEventListener("click", function() {
	// tglClasses('hide', credsDiv, arrowContainer, mobileMenuIcon, opContainer);
	tglClasses('hide', credsContainer, leftArrow, rightArrow, mobileMenuIcon, opContainer);
	// tglClasses('hide', credsContainer, arrowContainer, mobileMenuIcon, opContainer);
	if (itemsInCart.value > 0) { addClasses('show', cart); }
	if (!mobileMenuIcon.classList.contains('hide')) {
		// rmClasses('select', join, joinDiv, login, loginDiv, credsDiv, credsForm, logoutDiv);
		// rmClasses('hide', credsDiv);
		rmClasses('select', join, joinDiv, login, loginDiv, credsContainer, credsForm, logoutDiv);
		rmClasses('hide', credsContainer);
		rmClasses('show', cart);
		rmClasses('open', cart, review, shoppingBag);
		rmClasses('empty', cart, review, shoppingBag);
	}
});

const resetAfterResize = (elm, min) => {
	if (window.innerWidth < min 
			&& !(mobileMenuIcon.classList.contains('hide'))
			&& (join.classList.contains('select') 
			|| login.classList.contains('select')
			|| logout.classList.contains('select')
		)) {
		elm.click();
		// bug: credsDiv still keeps 'hide' w/logout, may be due to shared func w/login
		// if (!credsDiv.classList.contains('select')) {
			rmClasses('hide', credsContainer);
			// rmClasses('hide', credsDiv);
		// }
		
	} else {
		if (itemsInCart.value > 0) { addClasses('show', cart); }
	}
}

const delay = 1000;
let isThrottled = false;
// Source: http://bencentra.com/code/2015/02/27/optimizing-window-resize.html
window.addEventListener('resize', function() {
	if (!isThrottled) {
		isThrottled = true;
		setTimeout(function() {
			resetAfterResize(join, 512);
			resetAfterResize(login, 512);
			resetAfterResize(logout, 512);
			isThrottled = false;
		}, delay);
	}
})

// const hideMenus = () => {
// 	return window.setInterval(function() {
// 		addClasses('hide', credsDiv, opContainer, arrowContainer);
// 	}, 5000);
// }

// let hider = hideMenus();

// window.addEventListener("keypress", function() {
// 	rmClasses('hide', credsDiv, opContainer, arrowContainer);
// 	clearInterval(hider);
// 	hider = hideMenus();
// }); 

// mobileMenuDiv.addEventListener("click", function() {
// 	rmClasses('hide', credsDiv, opContainer, arrowContainer);
// 	clearInterval(hider);
// 	hider = hideMenus();
// });

// leftArrow.addEventListener("click", function() {
// 	cycleLeft();
// 	rmClasses('hide', credsDiv, opContainer);
// 	clearInterval(hider);
// 	hider = hideMenus();
// });
// rightArrow.addEventListener("click", function() {
// 	cycleRight();
// 	rmClasses('hide', credsDiv, opContainer);
// 	clearInterval(hider);
// 	hider = hideMenus();
// });

Object.values(opEvents).map((num, idx) => { 
	num.addEventListener("mouseover", () => {
			switchOptions(opEvents[idx]);
		});
}); 