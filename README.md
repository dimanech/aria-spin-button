# aria-spin-button

WAI ARIA 1.1 AAA compliance implementation of spin button for integer numbers.

## Specs

Please see all specs here https://www.w3.org/TR/wai-aria-practices/#spinbutton

## Supporting browsers

* Chrome 75.0.3770.100
* Safari 12.1.1
* Firefox 67.0.4

---

* MacOS VoiceOver Utiltiy (v9 562.858) with Safari, Google Chrome
* Gnome Orca Screen Reader 3.32 with Firefox (Gecko) and Epiphany (WebKitGtk)

### Known limitations

* not accept exponential notation values, so `2e23` will not work in this input
* not accept floating point values, so values like `6.23` will not work

## Usage

You could initialize this component in this way:

```js
const SpinButton = require('aria-spin-button');
document.querySelectorAll('[role=spinbutton]').forEach(spinbutton =>
    new SpinButton(spinbutton).init());
```

## License

Copyright © 2019, D. Nechepurenko. Published under MIT license.
