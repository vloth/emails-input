/* global lib */
(function() {

  document.addEventListener('DOMContentLoaded', function() {
    const inputContainerNode = document.querySelector('#emails-input')
    const emailsInput = lib.EmailsInput(inputContainerNode)

    // expose instance for quick access in playground
    window.emailsInput = emailsInput

    document.querySelector('[data-action="add-email"]')
      .addEventListener('click', function() { emailsInput.addEmail(randomEmail()) })

    document.querySelector('[data-action="get-emails-count"]')
      .addEventListener('click', function() {
        const emails = emailsInput.getEmails()
        alert('there are ' + emails.length + ' valid email(s)')
      })
  })

  function randomEmail() { 
    return randomText(randomNum(3, 7)) + '@' + randomText(randomNum(2, 8)) + '.com'
  }

  function randomText(len) { 
    let str = ''
    const rand='abcdefghijklmnopqrstuvwxyz123456789'
 
    for (let i=0; i < len; i++) { 
      str += rand.charAt(Math.round(rand.length * Math.random()))
    }
 
    return str
  }

  function randomNum(min, max) { 
    return Math.floor(Math.random() * max) + min
  }

}())
