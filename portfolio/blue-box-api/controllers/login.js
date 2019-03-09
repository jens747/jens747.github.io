const handleLogin = (db, bcrypt, getUserInfo) => (req, res) => {
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
				getUserInfo('email', email)
				.then(user => res.json(user[0]))
				.catch(err => res.status(400).json('no match found'));
			} else {
				throw res.status(400).json('invalid credentials');
			}
		})
		.catch(err => res.status(400).json('access denied'));
}

module.exports = { handleLogin }