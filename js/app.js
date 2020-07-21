(function(EmailsInput, random) {
  'use strict'

  document.addEventListener('DOMContentLoaded', function() {
    const inputContainerNode = document.querySelector('#emails-input')
    const emailsInput = EmailsInput(inputContainerNode)

    // expose instance for quick access in playground
    window.emailsInput = emailsInput

    document.querySelector('[data-action="add-email"]')
      .addEventListener('click', function() { emailsInput.add(random.email()) })

    document.querySelector('[data-action="get-emails-count"]')
      .addEventListener('click', function() {
        const emails = emailsInput.getValue()
        alert('there are ' + emails.length + ' valid email(s)')
      })
  })

}(window.lib.EmailsInput, window.lib.utils.random))
