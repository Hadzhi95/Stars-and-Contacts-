 
function rgbToHex(r, g, b) {
	const hex = 16;

	return '#' + [r, g, b].map((x) => x.toString(hex).padStart(2, '0')).join('');
}


class CanvasHelper {

	constructor(width, height) {
		this._width = width;
		this._height = height;
	}

	init(rootEl) {
		const root = document.getElementById(rootEl);
		cgn.assert.ok(root);

		this._canvas = document.createElement('canvas');
		this._canvas.width = this._width;
		this._canvas.height = this._height;

		this._ctx = this._canvas.getContext('2d');

		root.appendChild(this._canvas);

		return this;
	}

	fill(color) {
		this._ctx.beginPath();
		this._ctx.rect(0, 0, this._width, this._height);
		this._ctx.fillStyle = rgbToHex(color.r, color.g, color.b);
		this._ctx.fill();

		return this;
	}

	drawStar({ outerRadius, innerRadius = outerRadius / 2, x, y, spikes, color }) {
		this._ctx.save();
		this._ctx.beginPath();
		this._ctx.translate(x, y);
		this._ctx.moveTo(0, 0 - outerRadius);
		for (let i = 0; i < spikes; i++) {
			this._ctx.rotate(Math.PI / spikes);
			this._ctx.lineTo(0, 0 - innerRadius);
			this._ctx.rotate(Math.PI / spikes);
			this._ctx.lineTo(0, 0 - outerRadius);
		}
		this._ctx.closePath();
		this._ctx.fillStyle = color;
		this._ctx.fill();
		this._ctx.restore();

		return this;
	}

	on(callback) {
		this._canvas.addEventListener('click', callback);

		return this;
	}

	getPixelColor(x, y) {
		const data = this._ctx.getImageData(x, y, 1, 1).data;

		return { r: data[0], g: data[1], b: data[2] };
	}

	_width = 0;
	_height = 0;
	_canvas = null;
	_ctx = null;
}

export default CanvasHelper;
