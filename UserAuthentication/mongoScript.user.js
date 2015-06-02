var emailSravani = 'sravani@seattleu.edu'
var emailIshwant = 'kauri@seattleu.edu'
var emailKevin = 'caink2@seattleu.edu'

db = db.getSiblingDB('budgy')
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
budget = db.getCollection("budget")
budget.remove({})
budget.insert(
{
	user_id: usersCollection.findOne({email: emailSravani})._id
}
)
budget.insert({
	user_id: usersCollection.findOne({email: emailIshwant})._id
}
)
budget.insert({
	user_id: usersCollection.findOne({email: emailKevin})._id
}
)