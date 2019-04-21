const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('../models/tasks');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true,
		validate(name) {
			if (validator.isNumeric(name)) {
				throw new Error('Name cannot contain numbers!!');
			}
		}
	},
	age: {
		type: Number,
		default: 0,
		validate(age) {
			if (age < 0) {
				throw new Error('Age cannot be less than zero!!');
			}
		}
	},
	email: {
		required: true,
		trim: true,
		unique: true,
		lowercase: true,
		type: String,
		validate(email) {
			if (!validator.isEmail(email)) {
				throw new Error('Invalid email Id!!');
			}
		}
	},
	password: {
		required: true,
		trim: true,
		minlength: 7,
		type: String,
		validate(pwd) {
			if (pwd.toLowerCase().includes('password')) {
				throw new Error("Password cannot contain 'password'!!");
			}
		}
	},
	tokens: [{ token: { type: String, required: true } }]
});

userSchema.virtual('tasks', {
	ref: 'Task',
	localField: '_id',
	foreignField: 'owner'
});

userSchema.methods.toJSON = function() {
	const user = this;

	const userObject = user.toObject();
	delete userObject.password;
	delete userObject.tokens;
	return userObject;
};

userSchema.methods.generateAuthToken = async function() {
	const user = this;
	const token = jwt.sign({ _id: user._id.toString() }, 'supersecretkey');
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error('Unable to login');
	}
	const isMatch = await bcryptjs.compare(password, user.password);
	if (!isMatch) {
		throw new Error('Unable to login');
	}
	return user;
};

userSchema.pre('save', async function(next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcryptjs.hash(user.password, 8);
	}
	next();
});

userSchema.pre('remove', async function() {
	const user = this;
	await Task.deleteMany({ owner: user._id });
	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
