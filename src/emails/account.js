const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SEND_GRID_API);

const sendWelcomeMail = (email, name) => {
	sgMail.send({
		to: email,
		from: 'c.jainn26@gmail.com',
		subject: 'Welcome to task manager',
		text: `Welcome to the app, ${name}. Hope you enjoy the app. Shoot me an email for any queries!`
	});
};

const cancellationMail = (email, name) => {
	sgMail.send({
		to: email,
		from: 'c.jainn26@gmail.com',
		subject: 'Sorry to see you go',
		text: `Goodbye, ${name}. Hope you enjoyed the app. Let us know what we could have done better?`
	});
};

module.exports = { sendWelcomeMail, cancellationMail };
