import Backbone from 'backbone';
import Handlebars from 'handlebars';
import { showMessage } from './helpers.js';

const TEMPLATE = require('@res/html/backbone_item_view.html');
class BackboneUserView extends Backbone.View {
	render() {
		const edit = this.model.get('edit');

		this.el.innerHTML = this.template(this.model.toJSON());
		this.cached.dom = {
			editButton: this.el.querySelector('#edit'),
			deleteButton: this.el.querySelector('#remove'),
			saveButton: this.el.querySelector('#save'),
			nameInput: this.el.querySelector('#name-input'),
			phoneInput: this.el.querySelector('#phone-input')
		};

		this.cached.dom.editButton.addEventListener('click', this.toggleEditMode.bind(this));
		this.cached.dom.saveButton.addEventListener('click', this.confirmEdit.bind(this));
		this.cached.dom.deleteButton.addEventListener('click', this.deleteSelfEntry.bind(this));

		this.el.querySelectorAll(`.${edit ? 'view' : 'edit'}-item`).forEach((e) => {
			e.classList.add('hidden');
		});

		return this;
	}

	remove() {
		this.el.parentElement.removeChild(this.el);

		return this;
	}

	constructor({ model }) {
		super({ model });

		this.el = document.createElement('tr');

		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	}

	setEditMode(edit) {
		this.model.set('edit', edit);
	}

	toggleEditMode() {
		this.setEditMode(!this.model.get('edit'));
	}

	confirmEdit() {
		const attributes = {
			name: this.cached.dom.nameInput.value,
			phone: this.cached.dom.phoneInput.value
		};
		if (this.model.validate(attributes)) {
			for (const key in attributes) {
				this.model.set(key, attributes[key]);
			}
			this.toggleEditMode();
		} else {
			showMessage('input invalid');
		}
	}

	deleteSelfEntry() {
		this.model.destroy();
	}

	template = Handlebars.compile(TEMPLATE);

	tagName = 'table';

	cached = {
		dom: {}
	};
}

export default BackboneUserView;
