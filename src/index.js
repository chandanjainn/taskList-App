require('dotenv').config();
const express = require('express');
const userRouter = require('./router/user');
const taskRouter = require('./router/tasks');
require('./db/mongoose');

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
	console.log('Node Server is *.* on port', PORT);
});
