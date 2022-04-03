import LoggerCore from '@lib/logger.js';

LoggerCore.useDefaults();
LoggerCore.setLevel(LoggerCore.LOG);

const DEFAULT_LOGGING_LEVEL = 2;

const GROUPS = {
	CORE_EVENTS: 5
};


class Logger {
	groups = GROUPS;
	loggingLevel = DEFAULT_LOGGING_LEVEL;

	constructor() {
		this.group.log = this.group.bind(this);
		this.group.warn = this.groupWarn.bind(this);
		this.group.error = this.groupError.bind(this);
	}

	groupWithLevel(group, level, ...args) {
		const groupLevel = this.groups[group];
		if (groupLevel && this.loggingLevel >= groupLevel) {
			this[level](`${group}: `, ...args);
		}
	}

	group(group, ...args) {
		this.groupWithLevel(group, 'log', ...args);
	}
	groupError(group, ...args) {
		this.groupWithLevel(group, 'error', ...args);
	}

	groupWarn(group, ...args) {
		this.groupWithLevel(group, 'warn', ...args);
	}

	log(...args) {
		LoggerCore.log(...args);
	}

	warn(...args) {
		LoggerCore.warn(...args);
	}

	error(...args) {
		LoggerCore.error(...args);
	}

	assignGroupLevels(levels) {
		this.groups = Object.assign(this.groups, levels);
	}
}

export default new Logger();
