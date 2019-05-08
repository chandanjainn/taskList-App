require('dotenv').config();
const app = require('./app');

const port = process.env.PORT;

app.listen(port, () => {
	console.log('Node Server is *.* on port', port);
});
