import Backbone from 'backbone';
import BackboneItemModel from './model.js';
import { LocalStorage } from 'backbone.localstorage';


class BackboneItemsCollection extends Backbone.Collection {

	constructor() {
		super();
		this.on('all', () => {
			this.localStorage.update(this);
			this.localStorage.save();
		});
	}

	validate(attributes) {
		return BackboneItemModel.validate(attributes);
	}
	nextOrder() {
		return this.length ? this.last().get('order') + 1 : 1;
	}
	comparator = 'order';
	model = BackboneItemModel;

	localStorage = new LocalStorage('backbone-users-collection');

	id = 'items-collection';
}

export default BackboneItemsCollection;
