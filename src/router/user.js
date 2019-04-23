const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');

const { sendWelcomeMail, cancellationMail } = require('../emails/account');

const userRouter = new express.Router();
const upload = multer({
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, callback) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return callback(new Error('File type not supported'));
		}
		return callback(undefined, true);
	}
});

userRouter.post('/users', async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		const token = await user.generateAuthToken();
		sendWelcomeMail(user.email, user.name);
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

userRouter.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter(token => {
			return req.token !== token.token;
		});
		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send(error);
	}
});

userRouter.post('/users/logoutAll', auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (error) {
		res.status(500).send(error);
	}
});

userRouter.get('/users/me', auth, async (req, res) => {
	res.send(req.user);
});

// userRouter.get('/users/:id', async (req, res) => {
// 	try {
// 		const user = await User.findById(req.params.id);
// 		if (!user) {
// 			return res.status(400).send();
// 		}
// 		res.send(user);
// 	} catch (err) {
// 		res.status(500).send();
// 	}
// });

userRouter.patch('/users/me', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'age', 'email', 'password'];
	const isValidOperation = updates.every(update =>
		allowedUpdates.includes(update)
	);
	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid update' });
	}

	try {
		//const user = await User.findById(req.params.id);
		updates.forEach(update => {
			req.user[update] = req.body[update];
		});
		await req.user.save();
		// const user = await User.findByIdAndUpdate(req.params.id, req.body, {	new: true,	runValidators: true});
		// if (!user) {
		// 	return res.status(400).send();
		// }
		res.send(req.user);
	} catch (err) {
		res.status(400).send();
	}
});

userRouter.delete('/users/:id', auth, async (req, res) => {
	try {
		// 	const user = await User.findByIdAndDelete(req.params.id);
		// 	if (!user) {
		// 		return res.status(400).send();
		// 	}
		await req.user.remove();
		res.send(req.user);
	} catch (err) {
		res.status(500).send();
	}
});

userRouter.post(
	'/users/me/avatar',
	auth,
	upload.single('avatar'),
	async (req, res) => {
		const buffer = await sharp(req.file.buffer)
			.resize({ width: 300, height: 300 })
			.png()
			.toBuffer();
		req.user.avatar = buffer;
		await req.user.save();
		res.send();
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);

userRouter.delete('/users/me/avatar', auth, async (req, res) => {
	req.user.avatar = undefined;
	cancellationMail(user.email, user.name);
	await req.user.save();
	res.send();
});

// userRouter.get('/users/me/avatar', auth, async (req, res) => {
// 	try {
// 		if (!req.user.avatar) {
// 			throw new Error('No Image found');
// 		}
// 		res.set('Content-Type', 'image/jpg');
// 		res.send(req.user.avatar);
// 	} catch (error) {
// 		res.status(400).send(error);
// 	}
// });

userRouter.get('/users/:id/avatar', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user || !user.avatar) {
			throw new Error('No Image found');
		}
		res.set('Content-Type', 'image/jpg');
		res.send(user.avatar);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = userRouter;
