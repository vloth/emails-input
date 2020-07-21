var lib = window.lib || { }

lib.EmailsInput = (function(utils) {
  'use strict'
  const keycode = { comma: 44, enter: 13, backspace: 8 }

  const EmailsInput = function(inputContainerNode, options) {
    this._options = buildOptions(options)
    this._listeners = setEventListeners(inputContainerNode, this._options)
    this._inputContainerNode = inputContainerNode

    init(inputContainerNode, this._options)
  }

  EmailsInput.prototype.add = function add(email) {
    const refElement = this._inputContainerNode.querySelector('input')
    addChip(refElement, email)
  }

  EmailsInput.prototype.remove = function remove(email) {
    getChips(this._inputContainerNode)
      .filter(function(chip) { return chip.firstChild.textContent === email })
      .forEach(function(chip) { chip.remove() })
  }

  EmailsInput.prototype.getValue = function getValue(options) {
    const chips = getChips(this._inputContainerNode)
    const includeInvalid = (options || { }).includeInvalid || false

    if (includeInvalid)
      return chips.map(function(chip) { return chip.firstChild.textContent })

    return chips
      .filter(function(chip) { return !chip.classList.contains('invalid') })
      .map(function(chip) { return chip.firstChild.textContent })
  }

  EmailsInput.prototype.destroy = function destroy() {
    const inputContainerNode = this._inputContainerNode
    inputContainerNode.innerHTML = ''
    this._listeners.forEach(function (listener) {
      inputContainerNode.removeEventListener(listener.event, listener.handler, false)
    })
    this._listeners = []
  }

  return function() {
    const instance = Object.create(EmailsInput.prototype)
    EmailsInput.apply(instance, Array.prototype.slice.call(arguments))
    return instance
  }

  /*** Private functions - access through hoisting ***/

  function init(inputContainerNode, options) {
    inputContainerNode.innerHTML = ' \
      <div class="emails emails-input"> \
        <input type="text" role="emails-input" placeholder="' + options.placeholder + '"> \
      </div> \
    '
  }

  function buildOptions(givenOptions) {
    const options = givenOptions || { }
    options.placeholder = options.placeholder || 'add more people ...'
    options.triggerKeyCodes = options.triggerKeyCodes || [keycode.enter, keycode.comma]
    options.pasteSplitPattern = options.pasteSplitPattern || /(?:,| )+/
    return options
  }

  function getChips(inputContainerNode) {
    return Array.prototype.slice
      .call(inputContainerNode.querySelectorAll('.emails-input .email-chip'))
  }

  function addChip(refElement, email) {
    const trimmedEmail = email && email.trim()
    if (!trimmedEmail) return

    const chip = document.createElement('span')
    chip.setAttribute('role', 'email-chip')
    chip.classList.add('email-chip')
    if (!isValidEmail(trimmedEmail))
      chip.classList.add('invalid')

    chip.innerHTML = '<span class="content">'
          + trimmedEmail + '</span><a href="#" class="remove">×</a>'

    refElement.parentNode.insertBefore(chip, refElement)
    refElement.value = ''
  }
    
  function setEventListeners(inputContainerNode, options) {
    const factory = utils.dom.makeEventListenerFactory(inputContainerNode)
    const addEventListener = factory.addEventListener

    addEventListener('click', function(event) {
      if (event.target.classList.contains('emails-input'))
        event.target.querySelector('input').focus()

      if (event.target.classList.contains('remove')) {
        inputContainerNode.querySelector('.emails-input')
          .removeChild(event.target.parentNode)
      }
    })

    addEventListener('focusout', function(event) {
      addChip(event.target, event.target.value)
    })

    addEventListener('paste', function(event) {
      if (!event.target.matches('input')) 
        return

      event.preventDefault()

      const chunks = event.clipboardData.getData('Text').split(options.pasteSplitPattern)
      if (chunks.length > 1) {
        chunks.forEach(function(chunk) { addChip(event.target, chunk) })
        return
      }

      const chunk = chunks[0]
      if (isValidEmail(chunk)) {
        addChip(event.target, chunk)
        return
      }

      event.target.value += chunk
    })

    addEventListener('keypress', function(event) {
      if (options.triggerKeyCodes.indexOf(event.keyCode) < 0)
        return
      event.preventDefault()
      addChip(event.target, event.target.value)
    })

    addEventListener('keydown', function(event) {
      if (event.keyCode === keycode.backspace && !event.target.value) {
        const chips = getChips(inputContainerNode)
        if (!chips.length) return
        const lastChip = chips[chips.length - 1]
        lastChip.remove()
      }
    })

    return factory.handlers
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

}(lib.utils))
