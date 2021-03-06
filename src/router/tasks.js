const express = require('express');
const Task = require('../models/tasks');
const taskRouter = new express.Router();
const auth = require('../middleware/auth');

taskRouter.get('/tasks', auth, async (req, res) => {
	try {
		const match = {};
		const sort = {};
		if (req.query.completed) {
			match.completed = req.query.completed === 'true';
		}

		if (req.query.sortBy) {
			const parts = req.query.sortBy.split(':');
			sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
		}

		//const task = await Task.find({ owner: req.user._id });
		await req.user
			.populate({
				path: 'tasks',
				match,
				options: {
					limit: parseInt(req.query.limit),
					skip: parseInt(req.query.skip),
					sort
				}
			})
			.execPopulate();
		res.send(req.user.tasks);
	} catch (err) {
		res.status(500).send();
	}
});

taskRouter.get('/tasks/:id', auth, async (req, res) => {
	try {
		const task = await Task.findOne({
			_id: req.params.id,
			owner: req.user._id
		});
		if (!task) {
			return res.status(400).send();
		}
		res.send(task);
	} catch (err) {
		res.status(500).send();
	}
});

taskRouter.patch('/tasks/:id', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['description', 'completed'];
	const isValidOperation = updates.every(update =>
		allowedUpdates.includes(update)
	);
	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid Update' });
	}

	try {
		//	const task = await Task.findById(req.params.id);
		const task = await Task.findOne({
			_id: req.params.id,
			owner: req.user._id
		});
		if (!task) {
			return res.status(400).send();
		}
		updates.forEach(update => (task[update] = req.body[update]));
		await task.save();

		//const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true,runValidators: true});

		res.send(task);
	} catch (err) {
		res.status(400).send();
	}
});

taskRouter.post('/tasks', auth, async (req, res) => {
	//const task = new Task(req.body);
	const task = new Task({
		...req.body,
		owner: req.user._id
	});
	try {
		await task.save();
		res.status(201).send(task);
	} catch (error) {
		res.status(400).send(error);
	}
});

taskRouter.delete('/tasks/:id', auth, async (req, res) => {
	try {
		//const task = await Task.findByIdAndDelete(req.params.id);
		const task = await Task.findOneAndDelete({
			_id: req.params.id,
			owner: req.user._id
		});

		if (!task) {
			return res.status(400).send();
		}
		res.send(task);
	} catch (err) {
		res.status(500).send();
	}
});

module.exports = taskRouter;
