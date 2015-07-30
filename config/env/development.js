'use strict';

module.exports = {
	db: 'mongodb://localhost/dsurvey-dev',
	app: {
		title: 'Dsurvey - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1080115615336271',
		clientSecret: process.env.FACEBOOK_SECRET || '4dfc909a778395bb8b5fc4e41bc5d2f4',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'O0QnK3JsCXjLja4Tbk9h2NpWD',
		clientSecret: process.env.TWITTER_SECRET || 'IjM46sq1rQq5FTiBHloKT39zOukVj34UskTgX4UEGoPZboluSs',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '911008727262-voh71s2sf84m8nv7gaatpllkm4ok1k7k.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || 'EVW4whEBAa9uX1mtBsgKF_UE',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
