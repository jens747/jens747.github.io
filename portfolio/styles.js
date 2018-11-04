const ra3 = document.querySelector("#ra3");
const smRect3 = document.getElementById("sm-rect3");

// const addIframe = () => {
// 	console.log(ra3.childNodes);
// 	if (ra3.childNodes.length < 6) {
// 		const newIframe = document.createElement("iframe");
// 		newIframe.id = "site3";
// 		// newIframe.src = "orange/orange.html";
// 		newIframe.src = "https://jens747.github.io/portfolio/orange/orange.html";
// 		// newIframe.sandbox = "";
// 		newIframe.style = (" \
// 			height: 24vh; \
// 			width: 30vw; \
// 			border: none; \
// 			position: absolute; \
// 			margin-top: 50vh; \
// 			margin-left: 70vw; \
// 			z-index: 150; \
// 			display: flex \
// 			align-self: center; \
// 		");
// 		ra3.appendChild(newIframe);
// 		console.log("load");
// 	}
// }

// const delIframe = (ix) => {
// 	console.log(ix.target.lastChild);
// 	ix.currentTarget.lastChild.remove();
// }

// ra3.addEventListener("mouseover", addIframe);
// ra3.addEventListener("mouseleave", delIframe);

const rShow = () => {
	lgRect3.classList.add("show");
}

const rHide = () => {
	lgRect3.classList.remove("show");
}

// ra3.addEventListener("mouseover", rShow);
// ra3.addEventListener("mouseleave", rHide);

const smt1 = document.getElementById("smt1");
const rd1 = document.getElementById("rd1");
const rd2 = document.getElementById("rd2");
const rd3 = document.getElementById("rd3");
const rd4 = document.getElementById("rd4");
const lgRect1 = document.getElementById("lg-rect1");
const lgRect2 = document.getElementById("lg-rect2");
const lgRect3 = document.getElementById("lg-rect3");
const lgRect4 = document.getElementById("lg-rect4");
const idx1 = document.getElementById("index1");
const idx2 = document.getElementById("index2");
const idx3 = document.getElementById("index3");
const idx4 = document.getElementById("index4");
const ri1 = document.getElementById("ri1");
const ri2 = document.getElementById("ri2");
const ri3 = document.getElementById("ri3");
const ri4 = document.getElementById("ri4");
const rp1 = document.getElementById("rp1");
const rp2 = document.getElementById("rp2");
const rp3 = document.getElementById("rp3");
const rp4 = document.getElementById("rp4");

const rToggle = (e, rd, lg, ix, ri, rp) => {
	e.classList.toggle('show');
	rd.classList.toggle('show');
	lg.classList.toggle('show');
	ix.classList.toggle('show');
	ri.classList.toggle('show');
	rp.classList.toggle('show');
}

// smt1.addEventListener("click", rtoggle(smt1));