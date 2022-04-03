
import assert from 'assert';

export default new Proxy(assert, {
	get(target, prop) {
		const field = target[prop];
		if (typeof field === 'function') {
			return (...args) => {
				try {
					field(...args);
				} catch (err) {
					throw new Error(err);
				}
			};
		}

		return field;
	}
});
