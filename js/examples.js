(function(EmailsInput) {
  'use strict'

  document.addEventListener('DOMContentLoaded', function() {
    EmailsInput(document.querySelector('#sample1'), { triggerKeyCodes: [13, 32] })
    EmailsInput(document.querySelector('#sample2'))
    EmailsInput(document.querySelector('#sample3'), { pasteSplitPattern: ',' })
  })

}(window.lib.EmailsInput))
