const opContainer = document.getElementById("op-container");
const goContainer = document.getElementById("go-container");
const go = document.getElementById("go");

// taken from:
// https://www.w3schools.com/js/tryit.asp?filename=tryjs_dom_animate_3
// const showGo = () => {
// 	var xPos = 0;
// 	var yPos = 0;
// 	var animate = setInterval(state, 4);

// 	const state = () => {
// 		if (xPos == 100) {
// 			clearInterval(animate);
// 		} else {
// 			xPos++;
// 			go.style.left = xPos + 'px';
// 			go.style.color
// 		}
// 	}
// }

/********************************************/
/* displays join and login info when clicked */
/********************************************/
let joinBool = false;
let loginBool = false;

// *****BROKEN*****
// would replace the following two functions,
// EXCEPT can't get to change booleans above

// const accountAccess = (sw1, sw2, bo1, bo2) => {
// 	if (!bo1) {
// 		bo1 = true;
// 		sw1.classList.add('select');

// 		if (bo2) {
// 			bo2 = false;
// 			sw2.classList.remove('select');
// 			return;
// 		}

// 		credsDiv.classList.add('select');
// 		credsForm.classList.add('select');		
// 	} else {
// 		bo1 = false;
// 		sw1.classList.remove('select');
// 		credsDiv.classList.remove('select');
// 		credsForm.classList.remove('select');
// 	}
// }

// opens/closes/switches join menu
const joinClick = () => {
	// when clicked, open join menu if closed
	if (!joinBool) {
		joinBool = true;
		join.classList.add('select');
		joinDiv.classList.add('select');
		//**had to add joinForm to these functions to get Join contents to work**
		joinForm.classList.add('select');
		// if login menu already open, switch to join menu
		if (loginBool) {
			loginBool = false;
			login.classList.remove('select');
			loginDiv.classList.remove('select');
			return;
		}

		credsDiv.classList.add('select');
		credsForm.classList.add('select');
	// when clicked, close join menu if open
	} else {
		joinBool = false;
		join.classList.remove('select');
		joinDiv.classList.remove('select');
		//**had to add joinForm to these functions to get Join contents to work**
		joinForm.classList.remove('select');
		credsDiv.classList.remove('select');
		credsForm.classList.remove('select');
	}
}

// opens/closes/switches login menu
const loginClick = () => {
	// when clicked, open login menu if closed
	if (!loginBool) {
		loginBool = true;
		login.classList.add('select');
		loginDiv.classList.add('select');
		// if join menu alread open, switch to login menu
		if (joinBool) {
			joinBool = false;
			join.classList.remove('select');
			joinDiv.classList.remove('select');
			//**had to add joinForm to these functions to get Join contents to work**
			joinForm.classList.remove('select');
			return;
		}

		credsDiv.classList.add('select');
		credsForm.classList.add('select');
	// when clicked, close login menu if open
	} else {
		loginBool = false;
		login.classList.remove('select');
		loginDiv.classList.remove('select');
		credsDiv.classList.remove('select');
		credsForm.classList.remove('select');
	}
}

/********************************************/
/* shows "Go" when hovering over menu */
/********************************************/
// const showGo = () => {
// 	go.classList.add('animate');
// 	goContainer.classList.add('animate');
// }

// const hideGo = () => {
// 	go.classList.remove('animate');
// 	goContainer.classList.remove('animate');
// }

/********************************************/
/* load products */
/********************************************/
const loadProducts = fetch("https://jens747.github.io/orange/spices.js")
	// .then(response => response.json())
	.then(data => {
		console.log(data)
	});
		
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
	// display specific formatting based on case
	switch(page) {
		case home:
			home.classList.add('lg');
			products.classList.add('md');
			leftArrow.classList.remove('display');
			productsPanel.classList.remove('show');
			selected = 0;
			break;
		case products:
			home.classList.add('md');
			products.classList.add('lg');
			orders.classList.add('md');
			productsPanel.classList.add('show');
			selected = 1;
			break;
		case orders:
			products.classList.add('md');
			orders.classList.add('lg');
			account.classList.add('md');
			productsPanel.classList.remove('show');
			selected = 2;
			break;
		case account:
			products.classList.remove('productsLoad');
			orders.classList.add('md');
			account.classList.add('lg');
			about.classList.add('md');
			productsPanel.classList.remove('show');
			selected = 3;
			break;
		case about:
			products.classList.remove('productsLoad');
			account.classList.add('md');
			about.classList.add('lg');
			rightArrow.classList.add('display');
			productsPanel.classList.remove('show');
			selected = 4;
			break;
	}
}

const productsPanel = document.getElementById('products-panel');

// const circleType = new CircleType(document.getElementById('coSubtitle'));
// window.addEventListener('resize', function updateRadius() {
//   circleType.radius(circleType.element.offsetWidth / 2);
// });
// updateRadius();
