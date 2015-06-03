db = db.getSiblingDB('budgy')

var emailSravani = 'sravani@seattleu.edu'
var emailIshwant = 'kauri@seattleu.edu'
var emailKevin = 'caink2@seattleu.edu'

db.createCollection('users')
usersCollection = db.getCollection("users")
usersCollection.remove({})
usersCollection.insert(
{
	fName: 'User',
	lName: '1',
	username: 'sravani',
	email: emailSravani,
	extra: 'Sravani info',
	hashed_pwd: 'n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg='
}
)
usersCollection.insert(
{
	fName: 'User',
	lName: '2',
	username: 'ishwant',
	email: emailIshwant,
	extra: 'Ishwant info',
	hashed_pwd: 'n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg='
}
)
usersCollection.insert(
{
	fName: 'kevin',
	lName: 'cain',
	username: 'caink2',
	email: emailKevin,
	extra: 'Kevin info',
	hashed_pwd: 'n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg='
}
)

db.createCollection('budget')
budgetCollection = db.getCollection("budget")
budgetCollection.remove({})
budgetCollection.insert(
{
	user_id: usersCollection.findOne({email: emailSravani})._id
}
)
budgetCollection.insert({
	user_id: usersCollection.findOne({email: emailIshwant})._id
}
)
budgetCollection.insert({
	user_id: usersCollection.findOne({email: emailKevin})._id
}
)

var kevinsBudget = budgetCollection.findOne
	({user_id: usersCollection.findOne({email: emailKevin})._id})

	db.createCollection("envelope")
	db.envelope.insert(
	{
		bid: kevinsBudget._id.valueOf(),
		category: "Groceries",
		amount: 300,
		transactions : [
			{
				_id : ObjectId(),
				description : "safeway",
				expense : 10,
				date : ISODate()
			}
		]
	}
)

// db = db.getSiblingDB('budgy')
// db.createCollection("envelope")
// db.envelope.insert(
	// {
		// bid: "1",
		// cid: "1",
		// category: "Groceries",
		// amount: 300,
		// spent: 10,
		// balance: 290,
		// transactions : [
			// {
				// description : "safeway",
				// expense : 10,
				// date : "05-03-2015"
			// }
		// ]
	// }
// )
// db.envelope.insert(
	// {
		// bid: "1",
		// cid: "2",
		// category: "Education",
		// amount: 2250,
		// spent: 1350,
		// balance: 900,
		// transactions : [
			// {
				// description : "College Fee",
				// expense : 1000,
				// date : "05-13-2015"
			// },
			// {
				// description : "Books",
				// expense : 250,
				// date : "05-20-2015"
			// },
			// {
				// description : "Staples",
				// expense : 50,
				// date : "05-13-2015"
			// },
			// {
				// description : "Office Depot",
				// expense : 50,
				// date : "05-09-2015"
			// }
			
		// ]
	// }
// )
// db.envelope.insert(
	// {
		// bid: "1",
		// cid: "3",
		// category: "Entertainment",
		// amount: 250,
		// spent: 140,
		// balance: 110,
		// transactions : [
			// {
				// description : "Avengers",
				// expense : 90,
				// date : "05-08-2015"
			// },
			// {
				// description : "Mariners Game",
				// expense : 50,
				// date : "05-09-2015"
			// }
		// ]
	// }
// )
// db.envelope.insert(
	// {
		// bid: "1",
		// cid: "4",
		// category: "donations",
		// amount: 500,
		// spent: 425,
		// balance: 75,
		// transactions : [
			// {
				// description : "RedCross",
				// expense : 425,
				// date : "05-03-2015"
			// }
		// ]
	// }
// )

categoryCollection = db.getCollection("categories")
categoryCollection.remove({})
categoryCollection.insert(
{
	cid: "1",
	name: "Groceries"
}
)
categoryCollection.insert(
{
	cid: "2",
	name: "Education"
}
)
categoryCollection.insert(
{
	cid: "3",
	name: "Entertainment"
}
)
categoryCollection.insert(
{
	cid: "4",
	name: "Gifts/donations"
}
)
categoryCollection.insert(
{
	cid: "5",
	name: "Heath Care/Medical"
}
)
categoryCollection.insert(
{
	cid: "6",
	name: "Shopping"
}
)
categoryCollection.insert(
{
	cid: "7",
	name: "Savings/Investment"
}
)
categoryCollection.insert(
{
	cid: "8",
	name: "Insurance"
}
)
categoryCollection.insert(
{
	cid: "9",
	name: "Income"
}
)
categoryCollection.insert(
{
	cid: "10",
	name: "Personal Care"
}
)
categoryCollection.insert(
{
	cid: "11",
	name: "Housing"
}
)
categoryCollection.insert(
{
	cid: "12",
	name: "Taxes"
}
)
categoryCollection.insert(
{
	cid: "13",
	name: "Travel"
}
)
categoryCollection.insert(
{
	cid: "14",
	name: "Children/Dependent expenses"
}
)
categoryCollection.insert(
{
	cid: "15",
	name: "Automobile expenses"
}
)
