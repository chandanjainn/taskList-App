const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
	name: { type: String, trim: true, required: true },
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
	}
});

module.exports = User;
