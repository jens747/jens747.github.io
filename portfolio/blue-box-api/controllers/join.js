const handleJoin = (req, res, db, bcrypt) => {
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
		.then(id => {
			return trx('blu.userinfo')
				.returning('ui_userfk')
				.insert({ ui_userfk: id[0] })
				.then(id => {
					return trx('blu.payinfo')
						.returning('pi_userfk')
						.insert({ pi_userfk: id[0] })
						.then(success => {
							res.json(success[0]);
							// res.status(200).json('account joined');
						})
				})
				.catch(err => res.status(400).json('no data match'));
		})
		.then(trx.commit)
		.catch(trx.rollback);
	})
	.catch(err => res.status(400).json('failed to join'));
}

module.exports = { handleJoin };