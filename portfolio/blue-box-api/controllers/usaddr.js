const handleUsaddr = (req, res, fs) => {
	fs.readFile('../orange/public/us-min.txt', (err, data) => {
		if (data === undefined) { 
			throw res.status(400).json('Could not get city.');
		}
		const cities = data.toString().split('\n');
		// res.set('cache-control', 'public, max-age=604800')
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
}

module.exports = { handleUsaddr }