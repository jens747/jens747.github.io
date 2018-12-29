/********************************************/
/* displays join, login, bag menu when clicked */
/********************************************/
// 0.Class added, 1-2,>=5. adds class 3-4. removes class
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

/********************************************/
/* login user */
/********************************************/
const loginEmail = document.getElementById("loginEmail");
const loginPass = document.getElementById("loginPass");
// const logout = document.getElementById("logout");
// const logoutDiv = document.getElementById("logoutDiv");

const loginUser = (email = loginEmail.value, pass = loginPass.value) => {
	
	// sending post of input to server
	fetch('http://localhost:3000/login', {
		method: 'post',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			email: email,
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
				openMenus('select', loDiv, logoutDiv);
				switchOptions(account);
				// console.log(data);
				userAccount(data[0]);

			// 	// loginEmail.value = "";
			// 	// loginPass.value = "";
			// }
		})
	})
	.catch(error => { console.log("Request denied"); })
}

// const userAccount = (...data) => {
// 	const accountPanel = document.getElementById("account-panel");
// 	data.map((user, idx) => {
// 		createTile(accountPanel, 'p', 'eText', `${user.fname} ${user.lname}`, 'eClass', 'panel-title');
// 	});	
// }

const userAccount = (d) => {
	const smPanelText = document.getElementsByClassName('sm-panel-text');
	smPanelText[0].textContent = `${d.first_name} ${d.last_name}`;
	smPanelText[1].textContent = `${d.email}`;
	// smPanelText[2].textContent = `${d.pass}`;
	smPanelText[3].textContent = `${d.street} ${d.city}, ${d.state_code} ${d.zip}`;
	// smPanelText[4].textContent 
	// 	= `**${trimData(2, d.card)} ${d.cardco} ${d.expiremn}/${d.expireyr}`;
	smPanelText[5].textContent = `${d.phone}`;
	smPanelText[6].textContent = `BB-1218-${d.id}`;
	smPanelText[7].textContent 
		= `${d.registered.substring(5, 10)}-${d.registered.substring(0, 4)}`;
}

const trimData = (len, data) => {
	if (data.length > len ? s = data.substring(data.length - len) : s = data);
	return s;
}

async function editAccount(e) {
	const a = await e.parentElement.firstElementChild;
	const b = await e.parentElement.firstElementChild.nextElementSibling;
	const c = await e.parentElement.previousElementSibling;
	if ((d = e.nextElementSibling) === null) { d = e.previousElementSibling; }
	// debugger;
	await openMenus('select', e, a, 0, 0, b, c, d);
}

/********************************************/
/* load products */
/********************************************/
const getProducts = fetch("http://jens747.github.io/portfolio/orange/spices.json")
	.then(response => response.json())
	.then(resolve => {
		console.log(resolve);
});

const getProds = () => {
	fetch("http://localhost:3000/spicy")
	.then(response => response.json())
	.then(resolve => {
		if (!boolProds) {
			printProds(resolve);
			boolProds = true;
			// addProdsEvents(resolve);
		} else {
			return;
		}
	});
}

// const loadProducts = new Promise((resolve, reject) => {
// 	if (true) {
// 		resolve(getProducts);
// 	} else {
// 		reject("Error");
// 	}
// });

// loadProducts
// 	.then(result => console.log(result))
// 	.catch(console.log);

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
			newDiv1, 'img', 'eClass', 'panel-img', 'eId', spice.imgId, 'eSrc', spice.img);

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
				newDiv3, 'span', 'eText', 'Source: ', 'eClass', 'span-p');
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
				'eText', spice.amtId,
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

		const newInput2 = createTile(
				newDiv5, 'input',
				'eClass', 'form-btn',
				'eId', spice.savId,
				'eType', 'submit',
				'eName', spice.savId,
				'eValue', 'Save'
			);

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
		newInput2.addEventListener("click", saveProduct);
		newInput3.addEventListener("click", addToCart);
	});
}

const scrollToTop = (element) => {
	element.scrollTo(0,0);
}

/********************************************/
/* update products in cart */
/********************************************/
const subBtn = document.getElementsByClassName("sub-btn");
const addBtn = document.getElementsByClassName("add-btn");
const cart = document.getElementById("cart");
const shoppingBag = document.getElementById("shopping-bag");
const itemsInCart = document.getElementById("cart-amt");

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

const addToCart = (event) => {
	const addItem = event.target.parentElement.previousSibling.previousSibling;
	
	if (addItem.value > 0 && itemsInCart.value < 99) {
		const cartTot = Number(itemsInCart.value) + Number(addItem.value);

		for (let items = 0; items < addItem.value; items++) {
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
		addItem.value = 0;
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
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

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
			Object.values(panels).map(num => num.classList.remove('show'));
			selected = 0;
			break;
		case products:
			home.classList.add('md');
			products.classList.add('lg');
			orders.classList.add('md');
			Object.values(panels).map(num => num.classList.remove('show'));
			panels[0].classList.add('show');
			getProds();
			selected = 1;
			break;
		case orders:
			products.classList.add('md');
			orders.classList.add('lg');
			account.classList.add('md');
			Object.values(panels).map(num => num.classList.remove('show'));
			panels[1].classList.add('show');
			selected = 2;
			break;
		case account:
			products.classList.remove('productsLoad');
			orders.classList.add('md');
			account.classList.add('lg');
			about.classList.add('md');
			Object.values(panels).map(num => num.classList.remove('show'));
			panels[2].classList.add('show');
			selected = 3;
			break;
		case about:
			products.classList.remove('productsLoad');
			account.classList.add('md');
			about.classList.add('lg');
			rightArrow.classList.add('display');
			Object.values(panels).map(num => num.classList.remove('show'));
			panels[3].classList.add('show');
			selected = 4;
			break;
	}
}

const productsPanel = document.getElementById('products-panel');
const ordersPanel = document.getElementById('orders-panel');

// const circleType = new CircleType(document.getElementById('coSubtitle'));
// window.addEventListener('resize', function updateRadius() {
//   circleType.radius(circleType.element.offsetWidth / 2);
// });
// updateRadius();
