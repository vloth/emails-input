var lib = window.lib || { }

lib.utils = (function() {
  'use strict'

  function randomEmail() { 
    return randomText(randomNum(3, 7)) + '@' + randomText(randomNum(2, 8)) + '.com'
  }

  function randomText(len) { 
    let str = ''
    const sample = 'abcdefghijklmnopqrstuvwxyz123456789'
    for (let i = 0; i < len; i++) { 
      str += sample.charAt(Math.round(sample.length * Math.random()))
    }
    return str
  }

  function randomNum(min, max) { 
    return Math.floor(Math.random() * max) + min
  }

  function makeEventListenerFactory(element) {
    const handlers = []
    function addEventListener(event, eventHandler) {
      const handler = element.addEventListener(event, eventHandler)
      handlers.push({ event: event, handler: handler })
    }
    return { handlers: handlers, addEventListener: addEventListener }
  }

  return {
    random: { email: randomEmail },
    dom: { makeEventListenerFactory: makeEventListenerFactory }
  }
}())
