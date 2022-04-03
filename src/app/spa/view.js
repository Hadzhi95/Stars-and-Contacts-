import Backbone from 'backbone';
import BackboneItemsCollection from './collection.js';
import BackboneUserView from './user_view.js';
import { showMessage } from './helpers.js';

const MODELS_TEMPLATE = require('@res/default-users.json');

class BackboneSpaView extends Backbone.View {
	constructor(rootEl) {
		super();

		this.el = rootEl;

		this.cached.dom = {
			newUserButton: document.querySelector('#create-new-user'),
			newUserName: document.querySelector('#new-user-name'),
			newUserPhone: document.querySelector('#new-user-phone')
		};

		this.cached.dom.newUserButton.addEventListener('click', this.createNewUserEntry.bind(this));
		this.collection = new BackboneItemsCollection();

		this.listenTo(this.collection, 'add', this.domAddNew);
		this.listenTo(this.collection, 'reset', this.domAddAllCollection);
		this.listenTo(this.model, 'change', this.render);

		this.collection.fetch();
		if (!this.collection.length) {
			this.collection.reset(MODELS_TEMPLATE);
		}
	}

	createNewUserEntry() {
		const attributes = {
			edit: false,
			name: this.cached.dom.newUserName.value,
			phone: this.cached.dom.newUserPhone.value
		};

		if (this.collection.validate(attributes)) {
			this.cached.dom.newUserName.value = '';
			this.cached.dom.newUserPhone.value = '';

			this.collection.create(attributes);
		} else {
			showMessage('input invalid');
		}
	}

	domAddNew(model) {
		const view = new BackboneUserView({ model });
		document.querySelector('#users-table').appendChild(view.render().el);
	}

	domAddAllCollection() {
		this.collection.each(this.domAddNew, this);
	}

	cached = {
		dom: {}
	};
}

export default BackboneSpaView;
