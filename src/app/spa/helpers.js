
export function showMessage(message) {
	const el = document.querySelector('#message-holder');
	el.classList.remove('show');

	el.innerHTML = message;
	el.classList.add('show');
	el.addEventListener('animationend', () => {
		el.classList.remove('show');
	});
}
