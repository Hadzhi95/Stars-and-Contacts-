class BackboneItemModel extends Backbone.Model {
	defaults = {
		name: 'John',
		phone: '+123',
		edit: false
	};

	static validate(attributes) {
		return Boolean(attributes.name.length && attributes.phone.match(/^\+?(?<phone>\d+-?)+$/u));
	}
	validate(attributes) {
		return BackboneItemModel.validate(attributes);
	}
}

export default BackboneItemModel;
