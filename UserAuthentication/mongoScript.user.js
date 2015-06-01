db = db.getSiblingDB('budgy')
db.createCollection('users')
usersCollection = db.getCollection("users")
usersCollection.remove({})
usersCollection.insert(
{
	fName: 'User',
	lName: '1',
	username: 'sravani',
	email: 'sravani@seattleu.edu',
	extra: 'Sravani info',
	hashed_pwd: 'n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg='
}
)
usersCollection.insert(
{
	fName: 'User',
	lName: '2',
	username: 'ishwant',
	email: 'Ishwant',
	extra: 'Ishwant info',
	hashed_pwd: 'n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg='
}
)
usersCollection.insert(
{
	fName: 'User',
	lName: '3',
	username: 'Kevin',
	email: 'kevin@seattleu.edu',
	extra: 'Kevin info',
	hashed_pwd: 'n4bQgYhMfWWaL+qgxVrQFaO/TxsrC4Is0V1sFbDwCgg='
}
)

user1 = usersCollection.findOne({username: 'user1'})
user1Id = user1._id.valueOf();
user2 = usersCollection.findOne({username: 'user2'})
user2Id = user2._id.valueOf();
user3 = usersCollection.findOne({username: 'user3'})
user3Id = user3._id.valueOf();
