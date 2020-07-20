## Emails Input  ![Test and Deploy](https://github.com/vloth/emails-input/workflows/Test%20and%20Deploy/badge.svg) 
Vanilla js implementation of emails input: a component to help filling emails in.

![screenshot](docs/print.png)

[Click here for a live demo](https://vloth.github.io/emails-input/) _(there is a global `emailsInput` object to play with)_.

### Goals
- vanilla js, zero dependency, no module bundlers, polyfills, libraries or frameworks;
- works in IE 11 and latest versions of Chrome, Safari, Firefox and Edge;
- automated tests using jsdom;

### Getting started
```js
  const inputContainerNode = document.querySelector('#emails-input')
  const emailsInput = lib.EmailsInput(inputContainerNode)
```

### API

-------
