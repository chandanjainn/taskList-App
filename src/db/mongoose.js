const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = encodeURI(process.env.MONGODB_URL);

mongoose.connect(mongoURL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
});
