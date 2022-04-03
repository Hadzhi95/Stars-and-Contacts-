import BackboneSpaView from './view.js';

const TEMPLATE = require('@res/html/backbone_spa_view.html');
const ROOT_EL_ID = 'approot';

import '@res/css/app.css';

class BackboneSpaManager {
	init() {
		const el = document.createElement('div');
		el.id = ROOT_EL_ID;
		el.innerHTML = TEMPLATE;
		document.body.appendChild(el);

		this.view = new BackboneSpaView(ROOT_EL_ID);

		return this;
	}
}

export default BackboneSpaManager;
