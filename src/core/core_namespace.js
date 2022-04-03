import logger from '@core/utils/logger.js';
import events from '@core/utils/events_manager.js';
import delays from '@core/utils/delays.js';
import assert from '@core/utils/assert.js';

const cgn = {
	log: logger,
	events,
	delays,
	assert
};

export default cgn;
