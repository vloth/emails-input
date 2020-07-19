const { ok, deepEqual } = require('assert')
const { load } = require('./tools/dom')
const { within } = require('@testing-library/dom')
const userEvent = require('@testing-library/user-event').default

describe('EmailsInput', function() {
  beforeEach(async function() {
    const dom = await load('src/index.html')
    this.container = within(dom.window.document)
  })

  it('should load emails input on page load', function() {
    const emailsInput = this.container.getByRole('emails-input')
    ok(emailsInput)
  })

  it('should create an email chip by pressing {enter}', async function() {
    const emailsInput = this.container.getByRole('emails-input')
    await userEvent.type(emailsInput, 'fran.fhb@gmail.com{enter}')

    ok(this.container.getByText('fran.fhb@gmail.com'))
  })

  it('should create an email chip by entering comma', async function() {
    const emailsInput = this.container.getByRole('emails-input')
    await userEvent.type(emailsInput, 'fran.fhb@gmail.com,')

    ok(this.container.getByText('fran.fhb@gmail.com'))
  })

  it('should create multiple chips', async function() {
    const chips = ['user.invalid', 'francisco@mail.com', 'fran.fhb@gmail.com']
    const emailsInput = this.container.getByRole('emails-input')
    await userEvent.type(emailsInput, chips.join('{enter}').concat('{enter}'))

    chips.forEach(chip => ok(this.container.getByText(chip)))
  })

  it('should create styled chip for invalid email', async function() {
    const emailsInput = this.container.getByRole('emails-input')
    await userEvent.type(emailsInput, 'invalid.user{enter}')
    const chip = this.container.getByText('invalid.user')

    ok(Array.from(chip.parentNode.classList).includes('invalid'))
  })

  it('should delete chip entering {backspace}', async function() {
    const emailsInput = this.container.getByRole('emails-input')
    await userEvent.type(emailsInput, 'invalid.user{enter}')
    ok(this.container.getByText('invalid.user'))

    await userEvent.type(emailsInput, '{backspace}')
    ok(this.container.queryByText('invalid.user') === null)
  })

  it('should delete chip by clicking on the remove link', async function() {
    const emailsInput = this.container.getByRole('emails-input')
    await userEvent.type(emailsInput, 'invalid.user{enter}')
    userEvent.click(this.container.getByRole('link', { name: '×' }))
    ok(this.container.queryByText('invalid.user') === null)
  })
})

describe('IndexPage', function() {
  beforeEach(async function() {
    const dom = await load('src/index.html')
    this.window = dom.window
    this.container = within(dom.window.document)
  })
    
  it('should add random email when clicking "Add email"', function() {
    userEvent.click(this.container.getByRole('button', { name: /add email/i }))
    ok(this.container.queryByRole('email-chip'))
  })

  it('should show valid emails count when clicking "Get emails count"', async function() {
    const alertCalls = []
    this.window.alert = (...args) => alertCalls.push(...args)

    const emailsInput = this.container.getByRole('emails-input')
    await userEvent.type(emailsInput, 'fran.fhb@gmail.com{enter}invalid.user{enter}')
    userEvent.click(this.container.getByRole('button', { name: /get emails count/i }))

    deepEqual(alertCalls, ['there are 1 valid email(s)'])
  })
})

