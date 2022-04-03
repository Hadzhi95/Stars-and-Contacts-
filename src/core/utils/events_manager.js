import CoreEvents from 'events';
import logger from '@core/utils/logger.js';

const MAX_LISTENERS = 100;

class EventsManager extends CoreEvents {
	_listenersCount = 0;

	_listeners = new Map();

	constructor() {
		super();
		this.setMaxListeners(MAX_LISTENERS);
	}

	init() {
		this._listenersCount = 0;
		this._listeners.forEach(({ id, func }) => {
			this.removeListener(id, func);
		});
	}

	discard(group) {
		this._listeners.forEach((listener) => {
			if (listener.group === group) {
				this.removeListener(listener.id, listener.func);
			}
		});
	}

	on(id, callback, context = null, group = 'default') {
		logger.group(
			logger.groups.CORE_EVENTS,
			`listen (${group}) event _${this._listenersCount} "${id}" for function`,
			callback
		);

		let func = callback;
		if (context) {
			func = func.bind(context);
		}

		this._listeners.set(++this._listenersCount, { id, func, group });
		super.addListener(id, func);

		return this._listenersCount;
	}

	addListener(id, callback, context = null, group = 'default') {
		return this.on(id, callback, context, group);
	}
	removeListener(id, callback) {
		if (callback) {
			logger.group(logger.groups.CORE_EVENTS, `unlisten event "${id}" for function`, callback);

			super.removeListener(id, callback);
		} else {
			if (!this._listeners.has(id)) {
				logger.group(logger.groups.CORE_EVENTS, `tried to unlisten event _${id} which not exists`);

				return;
			}

			const listener = this._listeners.get(id);
			logger.group(
				logger.groups.CORE_EVENTS,
				`unlisten event _${id} ("${listener.id}") for function`,
				listener.func
			);

			super.removeListener(listener.id, listener.func);
			this._listeners.delete(id);
		}
	}

	off(id, callback) {
		this.removeListener(id, callback);
	}
}

export default new EventsManager();
