import logger from '@core/utils/logger.js';
import events from '@core/utils/events_manager.js';

const Delays = {
	update(callback) {
		return events.once('update', (ms, dt) => {
			try {
				callback(ms, dt);
			} catch (err) {
				logger.error(err);
			}
		});
	},

	immediate(callback) {
		return requestAnimationFrame(() => {
			try {
				callback();
			} catch (err) {
				logger.error(err);
			}
		});
	},
	inteval(callback, time) {
		return setInterval(() => {
			try {
				callback();
			} catch (err) {
				logger.error(err);
			}
		}, time);
	},

	clearInterval(id) {
		clearInterval(id);
	},

	clearTimeout(id) {
		clearTimeout(id);
	},
  
	timeout(callback, time) {
		return setTimeout(() => {
			try {
				callback();
			} catch (err) {
				logger.error(err);
			}
		}, time);
	}
};

export default Delays;
