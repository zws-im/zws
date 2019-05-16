/* Copyright (C) 2018 Yousef Sultan <yousef.su.2000@gmail.com> - All Rights Reserved.
 * This document is proprietary and confidential.
 * Unauthorized copying of this file, via any medium, in whole or in part, is strictly prohibited.
 */

const Koa = require('koa');
const koaCompress = require('koa-compress');
const koaStatic = require('koa-static');
const fs = require('fs');

const logger = require('good-logger');

const app = new Koa();

const port = process.env.PORT || 3000;
const dbPath = './database.json';

logger.info('Loading DB…');

if (!fs.existsSync(dbPath)) {
	logger.info('DB not found! Creating new one…');
	fs.writeFileSync(dbPath, '[]');
}

const db = JSON.parse(fs.readFileSync(dbPath));

logger.info('DB loaded');

app
	.use((ctx, next) => {
		const ip = ctx.request.headers['cf-connecting-ip'] || ctx.ip;

		logger.info(`Processing request from ${ip}`);

		return next();
	})
	.use(koaCompress({
		threshold: 2048,
		flush: require('zlib').Z_SYNC_FLUSH
	}))
	.use(koaStatic('./public', {
		maxage: 1000 * 60 * 60 * 24 * 30,
	}))
	.use(ctx => {
		const { long } = ctx.query;

		if (ctx.path === '/shorten' && long) {
			const specials = ['\u180e', '\u200b'];
			const short = '/' + new Array(24).fill(0).map(() => Math.random() > 0.5 ? specials[0] : specials[1]).join('') + '+';

			if (db.some(row => row.short === short))
				return 'Error';

			db.push({
				short,
				long,
			});

			fs.writeFile(dbPath, JSON.stringify(db), err => {
				if (err)
					logger.err(`Could not shorten ${long} to ${short}: I/O error`);
				else
					logger.info(`Shortened ${long} to ${short}`);
			});

			ctx.body = { short };
		} else {
			const short = decodeURIComponent(ctx.path.split('+')[0] + '+');

			const record = db.find(row => row.short === short);

			if (record) {
				logger.info(`Redirecting ${short} to ${record.long}`);
				ctx.redirect(record.long);
			}
		}
	});

app.listen(port);

logger.info(`Running on port ${port}`);