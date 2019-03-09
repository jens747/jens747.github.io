const handlePay = (db) => (req, res) => {
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
}

module.exports = { handlePay }