const express = require('express');

require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/tasks').default;

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.post('/users', (req, res) => {
	const user = new User(req.body);
	user
		.save()
		.then(user => {
			res.status(201).send(user);
		})
		.catch(err => {
			res.status(400).send(err);
		});
});

app.get('/users', (req, res) => {
	User.find({})
		.then(users => {
			res.send(users);
		})
		.catch(() => {
			res.status(500).send();
		});
});

app.get('/users/:id', (req, res) => {
	User.findById(req.params.id)
		.then(user => {
			if (!user) {
				return res.status(400).send();
			}
			res.send(user);
		})
		.catch(() => {
			res.status(500).send();
		});
});

app.get('/tasks', (req, res) => {
	Task.find({})
		.then(tasks => {
			res.send(tasks);
		})
		.catch(() => {
			res.status(500).send();
		});
});

app.get('/tasks/:id', (req, res) => {
	Task.findById(req.params.id)
		.then(task => {
			if (!task) {
				return res.status(400).send();
			}
			res.send(task);
		})
		.catch(() => {
			res.status(500).send();
		});
});

app.post('/tasks', (req, res) => {
	const task = new Task(req.body);
	task
		.save()
		.then(task => {
			res.status(201).send(task);
		})
		.catch(err => {
			res.status(400).send(err);
		});
});

app.listen(PORT, () => {
	console.log('Server is up at port', PORT);
});
