const mongoose = require('mongoose');

const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api';
mongoose.connect(connectionURL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
});

// const task = new Task({
// 	description: 'Complete NodeJs course',
// 	completed: false
// });

// task
// 	.save()
// 	.then(() => {
// 		console.log(task);
// 	})
// 	.catch(err => {
// 		console.log('Error-', err.message);
// 	});

// const me = new User({
// 	name: 'piyush',
// 	age: 2,
// 	email: 'p@a.com',
// 	password: 'password'
// });

// me.save()
// 	.then(() => {
// 		console.log(me);
// 	})
// 	.catch(err => {
// 		console.log('Error', err.message);
// 	});



git remote add origin git@github.com:chandanjainn/taskList-App.git
git push -u origin master