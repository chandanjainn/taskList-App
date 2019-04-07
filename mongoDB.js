const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const dbName = 'task-manager';

MongoClient.connect(
	connectionURL,
	{ useNewUrlParser: true },
	(error, client) => {
		if (error) {
			return console.log(error);
		}
		const db = client.db(dbName);
		// db.collection('users').insertOne({ name: 'chandan', age: 25 });

		// db.collection('tasks').insertMany(
		// 	[
		// 		{ description: 'Task 1', completed: true },
		// 		{ description: 'Task 2', completed: false },
		// 		{ description: 'Task 3', completed: true }
		// 	],
		// 	(error, result) => {
		// 		if (error) {
		// 			return console.log(error);
		// 		}
		// 		console.log(result.ops);
		// 	}
		// );

		// db.collection('users').findOne(
		// 	{
		// 		_id: new ObjectID('5ca513328b4237159823b3d3')
		// 	},
		// 	(error, user) => {
		// 		console.log(user);
		// 	}
		// );
		// db.collection('tasks')
		// 	.find({
		// 		completed: true
		// 	})
		// 	.toArray((error, tasks) => {
		// 		console.log(tasks);
		// 	});
		// db.collection('tasks')
		// 	.find({
		// 		completed: true
		// 	})
		// 	.count((error, count) => {
		// 		console.log(count);
		// 	});
		// db.collection('users')
		// 	.updateOne(
		// 		{
		// 			_id: new ObjectID('5ca513328b4237159823b3d3')
		// 		},
		// 		{ $set: { name: 'Tan xiang' } }
		// 	)
		// 	.updatePromise.then(result => {
		// 		console.log(result);
		// 	})
		// 	.catch(error => {
		// 		console.log(error);
		// 	});

		// db.collection('tasks')
		// 	.updateMany(
		// 		{
		// 			completed: true
		// 		},
		// 		{ $set: { completed: false } }
		// 	)
		// 	.then(result => {
		// 		console.log(result);
		// 	})
		// 	.catch(error => {
		// 		console.log(error);
		// 	});

		db.collection('tasks')
			.deleteOne({
				description: 'Task 1'
			})
			.then(result => {
				console.log(result);
			})
			.catch(error => {
				console.log(error);
			});
	}
);
