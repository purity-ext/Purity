const removeFromList = async event => {
  const parent = event.target.parentElement
  const eventID = parent.getAttribute('data-event')

  const [{ url: _url, id }] = await browser.tabs.query({
    active: true,
    currentWindow: true
  })
  const url = new URL(_url).origin
  let [blockedEvents] = await browser.getValue(url)
  if (blockedEvents !== undefined) {
    blockedEvents = blockedEvents.filter(evt => evt !== eventID)
  }
  await browser.setValue({
    blockedEvents,
    url
  })
  parent.remove()
  await browser.tabs.reload(id)
}

const addToList = async () => {
  const inputElement = document.getElementById('append-textbox')
  const eventInput = inputElement.value
  if (eventInput.length === 0) {
    return
  }
  const events = eventInput.split(',')
  const [{ url: _url, id }] = await browser.tabs.query({
    active: true,
    currentWindow: true
  })
  const url = new URL(_url).origin

  let [blockedEvents] = await browser.getValue(url)
  const [appendBlock] = document.getElementsByClassName('append-block')
  events.forEach(async e => {
    e = e.trim()
    if (blockedEvents?.some(evt => evt === e)) {
      return
    }

    blockedEvents = [...(blockedEvents ?? []), e]

    const block = makeBlock(eventInput)
    appendBlock.before(block)
  })
  await browser.setValue({
    blockedEvents,
    url
  })

  inputElement.value = ''
  await browser.tabs.reload(id)
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

const toggleEnable = async event => {
  const [{ url: _url, id }] = await browser.tabs.query({
    active: true,
    currentWindow: true
  })
  const url = new URL(_url).origin
  await browser.setValue({
    isEnabled: event.target.checked,
    url
  })
  await browser.tabs.reload(id)
}

const savePreset = async name => {
  const [{ url: _url }] = await browser.tabs.query({
    active: true,
    currentWindow: true
  })
  const url = new URL(_url).origin
  const [blockedEvents] = await browser.getValue(url)

  await browser.setValue({
    presetName: name,
    blockedEvents
  })
  const saveLoadElement = document.getElementById('preset-save-or-load')
  saveLoadElement.innerText = 'Load'
}

const loadPreset = async name => {
  const [{ url: _url, id }] = await browser.tabs.query({
    active: true,
    currentWindow: true
  })
  const url = new URL(_url).origin
  const blockedEvents = await browser.getValue(name, true)
  await browser.setValue({
    blockedEvents,
    url
  })
  await browser.tabs.reload(id)
}

const saveLoadPreset = async () => {
  const presetInputElement = document.getElementById('preset-textbox')
  if (presetInputElement.value.length !== 0) {
    if (
      (await browser.getValue(presetInputElement.value, true)) !== undefined
    ) {
      loadPreset(presetInputElement.value)
    } else {
      savePreset(presetInputElement.value)
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const [{ url: _url }] = await browser.tabs.query({
    active: true,
    currentWindow: true
  })
  const url = new URL(_url).origin
  const [blockedEvents, isEnabled] = await browser.getValue(url)

  const checkbox = document.getElementById('enabled')
  checkbox.checked = isEnabled ?? true
  checkbox.addEventListener('input', toggleEnable)

  const [appendBlock] = document.getElementsByClassName('append-block')
  for (const eventName of blockedEvents ?? []) {
    const block = makeBlock(eventName)
    appendBlock.before(block)
  }

  const inputElement = document.getElementById('append-textbox')
  const saveLoadElement = document.getElementById('preset-save-or-load')
  const presetInputElement = document.getElementById('preset-textbox')
  const addButton = document.getElementById('add-event')
  inputElement.addEventListener('keydown', event => {
    // it's deprecated but i wasn't able to replace it with .code
    if (event.keyCode === 13) {
      event.preventDefault()
      addToList()
    }
  })
  presetInputElement.addEventListener('input', async event => {
    if (event.target.value.length !== 0) {
      if ((await browser.getValue(event.target.value, true)) !== undefined) {
        saveLoadElement.innerText = 'Load'
      } else {
        saveLoadElement.innerText = 'Save'
      }
    }
  })
  saveLoadElement.addEventListener('click', saveLoadPreset)
  presetInputElement.addEventListener('keydown', async event => {
    if (event.keyCode === 13) {
      event.preventDefault()
      saveLoadElement()
    }
  })
  addButton.addEventListener('click', addToList)
})
