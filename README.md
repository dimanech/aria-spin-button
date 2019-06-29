# ARIA SpinButton

ARIA SpinButton implementation. This implementation is confirmed with WAI ARIA AAA practices.

Please see all specs here https://www.w3.org/TR/wai-aria-practices/#spinbutton

### Limitations

* not accept exponential notation values, so `2e23` will not work in this input
* not accept floating point values, so values like `6.23` will not work

## Initialization

You could initialize this component in this way:

```js
const SpinButton = require('aria-spin-button');
document.querySelectorAll('[role=spinbutton]').forEach(spinbutton => new SpinButton(spinbutton).init());
```
