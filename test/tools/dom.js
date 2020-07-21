const { resolve } = require('path')
const { readFile } = require('fs/promises')
const { JSDOM, ResourceLoader } = require('jsdom')

class LocalResourceLoader extends ResourceLoader {
  constructor() {
    super()
    this.basePath = `file://${process.cwd()}/`
  }

  async fetch(url, options) {
    if (!url.startsWith(this.basePath))
      return this.fetchExternal(url, options)

    const path = url.replace(this.basePath, '')
    const fileContent = await readFile(resolve(path), 'utf-8')
    return Buffer.from(fileContent)
  }

  fetchExternal(url, options) {
    return url.includes('fonts.googleapis.com')
      ? super.fetch(url.replace('file://', 'http://'), options)
      : super.fetch(url, options)
  }
}

const load = async function load(file) {
  // runScripts: dangerously is required to run external scripts in jsdom environment
  const options = { runScripts: 'dangerously', resources: new LocalResourceLoader() }
  const dom = await JSDOM.fromFile(file, options)
  return new Promise(resolve =>
    dom.window.document.addEventListener('DOMContentLoaded', () => resolve(dom))
  )
}

module.exports = { load }
