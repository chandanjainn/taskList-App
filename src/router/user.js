const express = require('express');
const User = require('../models/user');
const userRouter = new express.Router();

userRouter.post('/users', async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (error) {
		res.status(400).send(error);
	}
});

userRouter.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (error) {
		res.status(400).send(error);
	}
});

userRouter.get('/users', async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (err) {
		res.status(500).send();
	}
});

userRouter.get('/users/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(400).send();
		}
		res.send(user);
	} catch (err) {
		res.status(500).send();
	}
});

userRouter.patch('/users/:id', async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'age', 'email', 'password'];
	const isValidOperation = updates.every(update =>
		allowedUpdates.includes(update)
	);
	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid update' });
	}

	try {
		const user = await User.findById(req.params.id);
		updates.forEach(update => {
			user[update] = req.body[update];
		});
		await user.save();
		// const user = await User.findByIdAndUpdate(req.params.id, req.body, {	new: true,	runValidators: true});
		if (!user) {
			return res.status(400).send();
		}
		res.send(user);
	} catch (err) {
		res.status(400).send();
	}
});

userRouter.delete('/users/:id', async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) {
			return res.status(400).send();
		}
		res.send(user);
	} catch (err) {
		res.status(500).send();
	}
});

module.exports = userRouter;
