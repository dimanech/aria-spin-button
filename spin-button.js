// https://www.w3.org/TR/wai-aria-practices/#spinbutton

class SpinButton {
	constructor(domNode) {
		this.input = domNode;
		this.incrementButton = this.input.nextElementSibling;
		this.decrementButton = this.input.previousElementSibling;
		this.minValue = parseInt(this.input.getAttribute('aria-valuemin'), 10);
		this.maxValue = parseInt(this.input.getAttribute('aria-valuemax'), 10);
		this.currentValue = this.input.value;

		this.keyCode = Object.freeze({
			PAGEUP: 33,
			PAGEDOWN: 34,
			END: 35,
			HOME: 36,
			UP: 38,
			DOWN: 40,
		});

		this.handleKeydown = this.handleKeydown.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.handleIncrement = this.increment.bind(this);
		this.handleDecrement = this.decrement.bind(this);
	}

	init() {
		this.addEventListeners();
		this.setInputValue(this.currentValue);
		this.handleComponentState();
	}

	addEventListeners() {
		this.input.addEventListener('keydown', this.handleKeydown);
		this.input.addEventListener('input', this.handleInput);

		this.incrementButton.addEventListener('click', this.handleIncrement);
		this.decrementButton.addEventListener('click', this.handleDecrement);
	}

	handleKeydown(event) {
		let preventEventActions = false;

		switch (event.keyCode) {
			case this.keyCode.UP:
				this.increment();
				preventEventActions = true;
				break;
			case this.keyCode.DOWN:
				this.decrement();
				preventEventActions = true;
				break;
			case this.keyCode.PAGEUP:
				this.filterInput(this.currentValue += 10);
				this.setInputValue(this.currentValue);
				preventEventActions = true;
				break;
			case this.keyCode.PAGEDOWN:
				this.filterInput(this.currentValue -= 10);
				this.setInputValue(this.currentValue);
				preventEventActions = true;
				break;
			case this.keyCode.HOME:
				this.setInputValue(this.minValue);
				preventEventActions = true;
				break;
			case this.keyCode.END:
				this.setInputValue(this.maxValue);
				preventEventActions = true;
				break;
			default:
				break;
		}

		if (preventEventActions) {
			event.stopPropagation();
			event.preventDefault();
		}
	}

	handleInput() {
		this.filterInput(this.input.value);
		this.setInputValue(this.currentValue);
	}

	increment() {
		this.filterInput(this.currentValue += 1);
		this.setInputValue(this.currentValue);
	}

	decrement() {
		this.filterInput(this.currentValue -= 1);
		this.setInputValue(this.currentValue);
	}

	filterInput(value) {
		if (value === '') {
			return this.currentValue = this.minValue;
		}

		const parsedInput = parseInt(value, 10);
		if (typeof parsedInput !== 'number' || Number.isNaN(parsedInput)) {
			return;
		}

		let result = parsedInput;

		if (parsedInput < this.minValue) {
			result = this.minValue;
		} else if (parsedInput > this.maxValue) {
			result = this.maxValue;
		}

		this.currentValue = result;
	}

	setInputValue(value) {
		this.input.setAttribute('aria-currentValue', value);
		this.input.value = value;

		this.handleButtonsState();
	}

	handleButtonsState() {
		this.currentValue <= this.minValue ?
				this.decrementButton.setAttribute('disabled', '') :
				this.decrementButton.removeAttribute('disabled');
		this.currentValue >= this.maxValue ?
				this.incrementButton.setAttribute('disabled', '') :
				this.incrementButton.removeAttribute('disabled');
	}

	handleComponentState() {
		if (this.input.getAttribute('disabled') !== null) {
			this.incrementButton.setAttribute('disabled', '');
			this.decrementButton.setAttribute('disabled', '');
		}
	}
}

var spinbutton = new SpinButton(document.getElementById('spinbutton'));
var spinbutton2 = new SpinButton(document.getElementById('spinbutton2'));
spinbutton.init();
spinbutton2.init();
