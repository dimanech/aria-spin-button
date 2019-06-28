export default class SpinButton {
    /*
     * SpinButton
     * See full specs https://www.w3.org/TR/wai-aria-practices/#spinbutton
     * @example:
     * 	<div class="spinbutton">
     *		<button tabindex="-1">-</button>
     *		<input
     *			type="text"
     *			value="0"
     *			role="spinbutton"
     *			aria-valuenow="0"
     *			aria-valuemin="0"
     *			aria-valuemax="50"
     *		/>
     *		<button tabindex="-1">+</button>
     *	</div>
     */
    constructor(domNode) {
        this.input = domNode;
        this.incrementButton = this.input.nextElementSibling;
        this.decrementButton = this.input.previousElementSibling;
        this.minValue = this.getMinValue();
        this.maxValue = this.getMaxValue();
        this.startValue = this.getStartValue();
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
        this.updateInputValue();
        this.initComponentState();
    }

    destroy() {
        this.removeEventListeners();
        this.initComponentState();
    }

    addEventListeners() {
        this.input.addEventListener('keydown', this.handleKeydown);
        this.input.addEventListener('input', this.handleInput);

        this.incrementButton.addEventListener('click', this.handleIncrement);
        this.decrementButton.addEventListener('click', this.handleDecrement);
    }

    removeEventListeners() {
        this.input.removeEventListener('keydown', this.handleKeydown);
        this.input.removeEventListener('input', this.handleInput);

        this.incrementButton.removeEventListener('click', this.handleIncrement);
        this.decrementButton.removeEventListener('click', this.handleDecrement);
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
                this.updateInputValue();
                preventEventActions = true;
                break;
            case this.keyCode.PAGEDOWN:
                this.filterInput(this.currentValue -= 10);
                this.updateInputValue();
                preventEventActions = true;
                break;
            case this.keyCode.HOME:
                this.currentValue = this.minValue;
                this.updateInputValue();
                preventEventActions = true;
                break;
            case this.keyCode.END:
                this.currentValue = this.minValue;
                this.updateInputValue();
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
        this.updateInputValue();
    }

    increment() {
        this.filterInput(this.currentValue += 1);
        this.updateInputValue();
    }

    decrement() {
        this.filterInput(this.currentValue -= 1);
        this.updateInputValue();
    }

    filterInput(value) {
        if (value === '' || value === '-') {
            return this.currentValue = this.startValue;
        }

        const parsedInput = parseInt(value, 10);
        if (Number.isNaN(parsedInput)) {
            return;
        }

        let result = parsedInput;

        if (parsedInput < this.minValue) {
            result = this.minValue;
        } else if (parsedInput > this.maxValue) {
            result = this.maxValue;
        }

        if (!isFinite(this.minValue)) {
            result = parsedInput;
        } else if (!isFinite(this.maxValue)) {
            result = parsedInput;
        }

        this.currentValue = result;
    }

    updateInputValue() {
        this.input.setAttribute('aria-currentValue', this.currentValue);
        this.input.value = this.currentValue;

        this.handleButtonsState();
    }

    handleButtonsState() {
        (this.currentValue <= this.minValue && isFinite(this.minValue)) ?
            this.decrementButton.setAttribute('disabled', '') :
            this.decrementButton.removeAttribute('disabled');
        (this.currentValue >= this.maxValue && isFinite(this.maxValue)) ?
            this.incrementButton.setAttribute('disabled', '') :
            this.incrementButton.removeAttribute('disabled');
    }

    initComponentState() {
        if (this.input.getAttribute('disabled') !== null) {
            this.incrementButton.setAttribute('disabled', '');
            this.decrementButton.setAttribute('disabled', '');
        }
    }

    getMinValue() {
        const min = this.input.getAttribute('aria-valuemin');
        const minParsed = parseInt(min, 10);

        return (min && !isNaN(minParsed)) ? minParsed : Infinity;
    }

    getMaxValue() {
        const max = this.input.getAttribute('aria-valuemax');
        const maxParsed = parseInt(max, 10);

        return (max && !isNaN(maxParsed)) ? maxParsed : Infinity;
    }

    getStartValue() {
        switch (true) {
            case !isFinite(this.minValue):
            case !isFinite(this.maxValue):
                return 0;
            case (this.minValue >= 0 && this.maxValue >= 0):
                return this.minValue;
            case (this.minValue <= 0 && this.maxValue <= 0):
                return this.maxValue;
            default:
                return 0;
        }
    }
};
