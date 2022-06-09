const exportAsJSON = async () => {
  const result = await browser.storage.local.get([
    'blockedEvents',
    'isEnabled',
    'defaultValue'
  ])
  return JSON.stringify(result)
}

const importFromJSON = async json => {
  const result = JSON.parse(json)
  await browser.storage.local.set(result)
  alert('Settings imported. Reload to see the change!')
}

const download = (filename, text) => {
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  )
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

const handleFileSelect = e => {
  const files = e.target.files
  if (files.length < 1) {
    return
  }
  const file = files[0]
  const reader = new FileReader()
  reader.onload = async () => {
    await importFromJSON(reader.result)
  }
  reader.readAsText(file, 'utf8')
}

const removeFromList = async event => {
  const parent = event.target.parentElement
  const eventID = parent.getAttribute('data-event')

  let defaultValue = await browser.getValue('defaultValue')
  if (defaultValue !== undefined) {
    defaultValue = defaultValue.filter(evt => evt !== eventID)
  }
  await browser.setValue({ defaultValue })
  parent.remove()
}

const addToList = async () => {
  const [inputElement] = document.getElementsByClassName('append-textbox')
  const event = inputElement.value
  if (event.length === 0) {
    return
  }
  let defaultValue = await browser.getValue('defaultValue')
  if (defaultValue?.some(evt => evt === event)) {
    return
  }

  defaultValue = [...(defaultValue ?? []), ...event.split(',')]
  await browser.setValue({ defaultValue })

  inputElement.value = ''

  const [appendBlock] = document.getElementsByClassName('append-block')
  const block = makeBlock(event)
  appendBlock.before(block)
}

const makeBlock = eventName => {
  const block = document.createElement('div')
  block.className = 'block'
  block.setAttribute('data-event', eventName)

  const eventText = document.createElement('p')
  eventText.innerHTML = eventName
  const spacer = document.createElement('div')
  spacer.className = 'spacer'
  const removeButton = document.createElement('button')
  removeButton.className = 'list-button'
  removeButton.id = 'remove-event'
  removeButton.innerHTML = '-'
  removeButton.addEventListener('click', removeFromList)

  block.append(eventText, spacer, removeButton)

  return block
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('import-button').addEventListener('click', () => {
    document.getElementById('file-picker').addEventListener('change', event => {
      handleFileSelect(event)
    })
    document.getElementById('file-picker').click()
  })

  document
    .getElementById('export-button')
    .addEventListener('click', async () => {
      const result = await exportAsJSON()
      download('puritySettings.json', result)
    })

  const defaultValue = await browser.getValue('defaultValue')

  const [appendBlock] = document.getElementsByClassName('append-block')
  for (const eventName of defaultValue ?? []) {
    const block = makeBlock(eventName)
    appendBlock.before(block)
  }

  const [inputElement] = document.getElementsByClassName('append-textbox')
  inputElement.addEventListener('keydown', event => {
    if (event.keyCode === 13) {
      event.preventDefault()
      addToList()
    }
  })
  const addButton = document.getElementById('add-event')
  addButton.addEventListener('click', addToList)
})