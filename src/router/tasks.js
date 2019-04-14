const express = require('express');
const Task = require('../models/tasks');
const taskRouter = new express.Router();

taskRouter.get('/tasks', (req, res) => {
	Task.find({})
		.then(tasks => {
			res.send(tasks);
		})
		.catch(() => {
			res.status(500).send();
		});
});

taskRouter.get('/tasks/:id', async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);
		if (!task) {
			return res.status(400).send();
		}
		res.send(task);
	} catch (err) {
		res.status(500).send();
	}
});

taskRouter.patch('/tasks/:id', async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['description', 'completed'];
	const isValidOperation = updates.every(update =>
		allowedUpdates.includes(update)
	);
	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid Update' });
	}

	try {
		const task = await Task.findById(req.params.id);
		updates.forEach(update => (task[update] = req.body[update]));
		task.save();

		//const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true,runValidators: true});
		if (!task) {
			return res.status(400).send();
		}
		res.send(task);
	} catch (err) {
		res.status(400).send();
	}
});

taskRouter.post('/tasks', async (req, res) => {
	const task = new Task(req.body);
	try {
		await task.save();
		res.status(201).send(task);
	} catch (error) {
		res.status(400).send(error);
	}
});

taskRouter.delete('/tasks/:id', async (req, res) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id);
		if (!task) {
			return res.status(400).send();
		}
		res.send(task);
	} catch (err) {
		res.status(500).send();
	}
});

module.exports = taskRouter;
