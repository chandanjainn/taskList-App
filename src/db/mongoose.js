const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = encodeURI(process.env.MONGODB_URL);

mongoose.connect(mongoURL, {
	uri_decode_auth: true,
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
});
