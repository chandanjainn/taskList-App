const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL, {
	uri_decode_auth: true,
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
});
