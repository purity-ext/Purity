const removeFromList = async event => {
  const parent = event.target.parentElement
  const eventID = parent.getAttribute('data-event')

  const { blockedEvents } = await browser.getSyncValue({
    blockedEvents: {}
  })
  const [{ url: _url, id }] = await browser.tabs.query({
    active: true,
    currentWindow: true
  })
  const url = new URL(_url).origin
  if (blockedEvents[url] !== undefined) {
    blockedEvents[url] = blockedEvents[url].filter(evt => evt !== eventID)
  }
  await browser.setSyncValue({
    blockedEvents
  })
  parent.remove()
  await browser.tabs.reload(id)
}

const addToList = async () => {
  const [inputElement] = document.getElementsByClassName('append-textbox')
  const event = inputElement.value
  if (event.length === 0) {
    return
  }

  const { blockedEvents } = await browser.getSyncValue({
    blockedEvents: {}
  })
  const [{ url: _url, id }] = await browser.tabs.query({
    active: true,
    currentWindow: true
  })
  const url = new URL(_url).origin
  if (blockedEvents[url]?.some(evt => evt === event)) {
    return
  }

  blockedEvents[url] = [...(blockedEvents[url] ?? []), ...event.split(',')]
  await browser.setSyncValue({
    blockedEvents
  })

  inputElement.value = ''

  const [appendBlock] = document.getElementsByClassName('append-block')
  const block = makeBlock(event)
  appendBlock.before(block)
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
  const { isEnabled } = await browser.getSyncValue({
    isEnabled: {}
  })
  const [{ url: _url, id }] = await browser.tabs.query({
    active: true,
    currentWindow: true
  })
  const url = new URL(_url).origin
  isEnabled[url] = event.target.checked
  await browser.setSyncValue({
    isEnabled
  })
  await browser.tabs.reload(id)
}

document.addEventListener('DOMContentLoaded', async () => {
  const { blockedEvents, isEnabled } = await browser.getSyncValue({
    blockedEvents: {},
    isEnabled: {}
  })
  const [{ url: _url }] = await browser.tabs.query({
    active: true,
    currentWindow: true
  })
  const url = new URL(_url).origin

  const checkbox = document.getElementById('enabled')
  checkbox.checked = isEnabled[url] ?? true
  checkbox.addEventListener('input', toggleEnable)

  const [appendBlock] = document.getElementsByClassName('append-block')
  for (const eventName of blockedEvents[url] ?? []) {
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
