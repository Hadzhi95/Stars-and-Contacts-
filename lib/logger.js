
(function (global) {
	"use strict";

	let Logger = { };

	Logger.VERSION = "1.7.0-next";

	let logHandler;

	let contextualLoggersByNameMap = {};

	let bind = function(scope, func) {
		return function() {
			return func.apply(scope, arguments);
		};
	};

	let merge = function () {
		let args = arguments, target = args[0], key, i;
		for (i = 1; i < args.length; i++) {
			for (key in args[i]) {
				if (!(key in target) && args[i].hasOwnProperty(key)) {
					target[key] = args[i][key];
				}
			}
		}
		return target;
	};

	let defineLogLevel = function(value, name) {
		return { value: value, name: name };
	};

	Logger.TRACE = defineLogLevel(1, 'TRACE');
	Logger.DEBUG = defineLogLevel(2, 'DEBUG');
	Logger.INFO = defineLogLevel(3, 'INFO');
	Logger.TIME = defineLogLevel(4, 'TIME');
	Logger.WARN = defineLogLevel(5, 'WARN');
	Logger.ERROR = defineLogLevel(8, 'ERROR');
	Logger.OFF = defineLogLevel(99, 'OFF');

	let ContextualLogger = function(defaultContext) {
		this.context = defaultContext;
		this.setLevel(defaultContext.filterLevel);
		this.log = this.info;  
	};

	ContextualLogger.prototype = {
		setLevel: function (newLevel) {
			if (newLevel && "value" in newLevel) {
				this.context.filterLevel = newLevel;
			}
		},

		getLevel: function () {
			return this.context.filterLevel;
		},

		enabledFor: function (lvl) {
			let filterLevel = this.context.filterLevel;
			return lvl.value >= filterLevel.value;
		},

		trace: function () {
			this.invoke(Logger.TRACE, arguments);
		},

		debug: function () {
			this.invoke(Logger.DEBUG, arguments);
		},

		info: function () {
			this.invoke(Logger.INFO, arguments);
		},

		warn: function () {
			this.invoke(Logger.WARN, arguments);
		},

		error: function () {
			this.invoke(Logger.ERROR, arguments);
		},

		time: function (label) {
			if (typeof label === 'string' && label.length > 0) {
				this.invoke(Logger.TIME, [ label, 'start' ]);
			}
		},

		timeEnd: function (label) {
			if (typeof label === 'string' && label.length > 0) {
				this.invoke(Logger.TIME, [ label, 'end' ]);
			}
		},

		invoke: function (level, msgArgs) {
			if (logHandler && this.enabledFor(level)) {
				logHandler(msgArgs, merge({ level: level }, this.context));
			}
		}
	};

	let globalLogger = new ContextualLogger({ filterLevel: Logger.OFF });

	(function() {
		let L = Logger;

		L.enabledFor = bind(globalLogger, globalLogger.enabledFor);
		L.trace = bind(globalLogger, globalLogger.trace);
		L.debug = bind(globalLogger, globalLogger.debug);
		L.time = bind(globalLogger, globalLogger.time);
		L.timeEnd = bind(globalLogger, globalLogger.timeEnd);
		L.info = bind(globalLogger, globalLogger.info);
		L.warn = bind(globalLogger, globalLogger.warn);
		L.error = bind(globalLogger, globalLogger.error);

		L.log = L.info;
	}());

	Logger.setHandler = function (func) {
		logHandler = func;
	};

	Logger.setLevel = function(level) {
		globalLogger.setLevel(level);

		for (let key in contextualLoggersByNameMap) {
			if (contextualLoggersByNameMap.hasOwnProperty(key)) {
				contextualLoggersByNameMap[key].setLevel(level);
			}
		}
	};

	Logger.getLevel = function() {
		return globalLogger.getLevel();
	};

	Logger.get = function (name) {
		return contextualLoggersByNameMap[name] ||
			(contextualLoggersByNameMap[name] = new ContextualLogger(merge({ name: name }, globalLogger.context)));
	};

	Logger.createDefaultHandler = function (options) {
		options = options || {};

		options.formatter = options.formatter || function defaultMessageFormatter(messages, context) {
			if (context.name) {
				messages.unshift("[" + context.name + "]");
			}
		};

		let timerStartTimeByLabelMap = {};

		let invokeConsoleMethod = function (hdlr, messages) {
			Function.prototype.apply.call(hdlr, console, messages);
		};

		if (typeof console === "undefined") {
			return function () { };
		}

		return function(messages, context) {
			messages = Array.prototype.slice.call(messages);

			let hdlr = console.log;
			let timerLabel;

			if (context.level === Logger.TIME) {
				timerLabel = (context.name ? '[' + context.name + '] ' : '') + messages[0];

				if (messages[1] === 'start') {
					if (console.time) {
						console.time(timerLabel);
					}
					else {
						timerStartTimeByLabelMap[timerLabel] = new Date().getTime();
					}
				}
				else {
					if (console.timeEnd) {
						console.timeEnd(timerLabel);
					}
					else {
						invokeConsoleMethod(hdlr, [ timerLabel + ': ' +
							(new Date().getTime() - timerStartTimeByLabelMap[timerLabel]) + 'ms' ]);
					}
				}
			}
			else {
				if (context.level === Logger.WARN && console.warn) {
					hdlr = console.warn;
				} else if (context.level === Logger.ERROR && console.error) {
					hdlr = console.error;
				} else if (context.level === Logger.INFO && console.info) {
					hdlr = console.info;
				} else if (context.level === Logger.DEBUG && console.debug) {
					hdlr = console.debug;
				} else if (context.level === Logger.TRACE && console.trace) {
					hdlr = console.trace;
				}

				options.formatter(messages, context);
				invokeConsoleMethod(hdlr, messages);
			}
		};
	};

	Logger.useDefaults = function(options) {
		Logger.setLevel(options && options.defaultLevel || Logger.DEBUG);
		Logger.setHandler(Logger.createDefaultHandler(options));
	};

	if (typeof define === 'function' && define.amd) {
		define(Logger);
	}
	else if (typeof module !== 'undefined' && module.exports) {
		module.exports = Logger;
	}
	else {
		Logger._prevLogger = global.Logger;

		Logger.noConflict = function () {
			global.Logger = Logger._prevLogger;
			return Logger;
		};

		global.Logger = Logger;
	}
}(this));
