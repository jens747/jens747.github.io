var opContainer = document.getElementById("op-container");
var goContainer = document.getElementById("go-container");
var go = document.getElementById("go");

// taken from:
// https://www.w3schools.com/js/tryit.asp?filename=tryjs_dom_animate_3
// function showGo() {
// 	var xPos = 0;
// 	var yPos = 0;
// 	var animate = setInterval(state, 4);

// 	function state() {
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
var joinBool = false;
var loginBool = false;

// *****BROKEN*****
// would replace the following two functions,
// EXCEPT can't get to change booleans above

// function accountAccess(sw1, sw2, bo1, bo2) {
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
function joinClick() {
	// when clicked, open join menu if closed
	if (!joinBool) {
		joinBool = true;
		join.classList.add('select');
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
		// loginDiv.classList.remove('select');
		credsDiv.classList.remove('select');
		credsForm.classList.remove('select');
	}
}

// opens/closes/switches login menu
function loginClick() {
	// when clicked, open login menu if closed
	if (!loginBool) {
		loginBool = true;
		login.classList.add('select');
		loginDiv.classList.add('select');
		// if join menu alread open, switch to login menu
		if (joinBool) {
			joinBool = false;
			join.classList.remove('select');
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
// function showGo() {
// 	go.classList.add('animate');
// 	goContainer.classList.add('animate');
// }

// function hideGo() {
// 	go.classList.remove('animate');
// 	goContainer.classList.remove('animate');
// }

/********************************************/
/* clicking menu selector arrows resizes options */
/********************************************/
var leftArrow = document.getElementById("left-arrow");
var rightArrow = document.getElementById("right-arrow");

var options = [home, products, orders, account, about];
var selected = 0;
select(options[selected]);

// hidden at load, cycles menu options to the left
function cycleLeft() {
	// displays right arrow on load
	rightArrow.classList.remove('display');
	// run if not at start of menu array, highlights prev menu item
	if (selected > 0) {
		selected--;
	}
	// hides left arrow if first menu item is highlighted
	// if (selected < 1) {
	// 	leftArrow.classList.remove('display');
	// }
	return switchOptions(options[selected]);
	// return select(options[selected]);
}

// visible at load, cycles menu options to the right
function cycleRight() {
	// hides left arrow on load
	leftArrow.classList.add('display');
	// run if not at end of menu array, highlights next menu item
	if (selected < (options.length - 1)) {
		selected++;
	}
	// hides right arrow if last menu item is highlighted
	// if (selected > (options.length - 2)) {
	// 	rightArrow.classList.add('display');
	// }
	return switchOptions(options[selected]);
}

function switchOptions(page) {
	// when called clear extra home formatting
	home.classList.remove('homeLoad');
	// when called display arrows by default
	leftArrow.classList.add('display');
	rightArrow.classList.remove('display');
	// when called removes formatting that was used when last called
	for (var i = options.length - 1; i >= 0; i--) {
		options[i].classList.remove('lg');
		options[i].classList.remove('md');
	}
	// display specific formatting based on case
	switch(page) {
		case home:
			home.classList.add('lg');
			products.classList.add('md');
			selected = 0;
			leftArrow.classList.remove('display');
			break;
		case products:
			home.classList.add('md');
			products.classList.add('lg');
			orders.classList.add('md');
			selected = 1;
			break;
		case orders:
			products.classList.add('md');
			orders.classList.add('lg');
			account.classList.add('md');
			selected = 2;
			break;
		case account:
			products.classList.remove('productsLoad');
			orders.classList.add('md');
			account.classList.add('lg');
			about.classList.add('md');
			selected = 3;
			break;
		case about:
			products.classList.remove('productsLoad');
			account.classList.add('md');
			about.classList.add('lg');
			selected = 4;
			rightArrow.classList.add('display');
			break;
	}
}

/********************************************/
/* menu selector arrows */
/********************************************/
function select(element) {
	element.classList.toggle('select');
}