const deleteBlockedPresets = ['Nothing', 'Blocked', 'Default Blocked Events']

const exportAsJSON = async () => {
  const result = await browser.storage.local.get([
    'blockedEvents',
    'isEnabled',
    'defaultValue',
    'presets'
  ])
  return JSON.stringify(result)
}

const importFromJSON = async json => {
  // to block importing any weird datas
  const { blockedEvents, isEnabled, defaultValue, presets } = JSON.parse(json)
  await browser.storage.local.set({
    blockedEvents,
    isEnabled,
    defaultValue,
    presets
  })
  window.location.reload()
}

const resetData = async () => {
  await browser.storage.local.set({
    blockedEvents: {},
    isEnabled: {},
    defaultValue: [],
    presets: {}
  })
  window.location.reload()
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

const removeFromList = event => {
  const parent = event.target.parentElement

  parent.remove()
}

const addToList = () => {
  const inputElement = document.getElementById('append-textbox')
  const eventInput = inputElement.value
  if (eventInput.length === 0) {
    return
  }
  const events = eventInput.split(',')

  const [appendBlock] = document.getElementsByClassName('append-block')
  let defaultValue = DOMtoEvents()
  events.forEach(e => {
    e = e.trim()
    if (defaultValue?.some(evt => evt === e)) {
      return
    }

    const block = makeBlock(e)
    appendBlock.before(block)
  })

  inputElement.value = ''
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

const savePreset = async name => {
  const blockedEvents = DOMtoEvents()

  await browser.setValue({
    presetName: name,
    blockedEvents
  })
  const saveLoadElement = document.getElementById('preset-save-or-load')
  const deletePresetButton = document.getElementById('delete-preset-button')
  saveLoadElement.innerText = 'Load'
  deletePresetButton.style = ''
}

const loadPreset = async name => {
  const blockedEvents = await browser.getValue(name, true)
  eventsToDOM(blockedEvents)
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

const deletePreset = async () => {
  const presetInputElement = document.getElementById('preset-textbox')
  const saveLoadElement = document.getElementById('preset-save-or-load')
  const deletePresetButton = document.getElementById('delete-preset-button')
  if (
    presetInputElement.value.length !== 0 &&
    !deleteBlockedPresets.includes(presetInputElement.value)
  ) {
    if (
      (await browser.getValue(presetInputElement.value, true)) !== undefined
    ) {
      await browser.setValue({
        presetName: presetInputElement.value
      })
      saveLoadElement.innerText = 'Save'
      deletePresetButton.style = 'display: none;'
      presetInputElement.value = ''
    }
  }
  eventsToDOM([])
}

const DOMtoEvents = () => {
  const [blocks] = document.getElementsByClassName('blocks')
  return Array.from(blocks.getElementsByClassName('block')).map(block =>
    block.getAttribute('data-event')
  )
}

const eventsToDOM = events => {
  const [blocks] = document.getElementsByClassName('blocks')
  const [appendBlock] = document.getElementsByClassName('append-block')
  Array.from(blocks.getElementsByClassName('block')).forEach(block =>
    block.remove()
  )
  events.forEach(e => {
    const block = makeBlock(e)
    appendBlock.before(block)
  })
}

const setAsDefaultEvents = async () => {
  const presetInputElement = document.getElementById('preset-textbox')
  const blockedEvents = DOMtoEvents()
  await browser.setValue({
    defaultValue: blockedEvents
  })
  presetInputElement.value = 'Default Blocked Events'
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
  const presets = await browser.getValue('presets')

  const [appendBlock] = document.getElementsByClassName('append-block')
  for (const eventName of defaultValue ?? []) {
    const block = makeBlock(eventName)
    appendBlock.before(block)
  }

  const datalist = document.getElementById('preset-list')
  Object.keys(presets).forEach(async name => {
    if (presets[name] !== undefined) {
      const option = document.createElement('option')
      option.value = name
      datalist.appendChild(option)
    }
  })

  const inputElement = document.getElementById('append-textbox')
  const saveLoadElement = document.getElementById('preset-save-or-load')
  const deletePresetButton = document.getElementById('delete-preset-button')
  const presetInputElement = document.getElementById('preset-textbox')
  const addButton = document.getElementById('add-event')
  const setAsDefaultButton = document.getElementById('set-as-default-button')
  const resetButton = document.getElementById('delete-all-button')

  inputElement.addEventListener('keydown', event => {
    if (event.keyCode === 13) {
      event.preventDefault()
      addToList()
    }
  })
  presetInputElement.addEventListener('input', async event => {
    if (event.target.value.length !== 0) {
      if ((await browser.getValue(event.target.value, true)) !== undefined) {
        saveLoadElement.innerText = 'Load'
        if (!deleteBlockedPresets.includes(event.target.value)) {
          deletePresetButton.style = ''
        }
        return
      }
    }
    saveLoadElement.innerText = 'Save'
    deletePresetButton.style = 'display: none;'
  })
  presetInputElement.value = 'Default Blocked Events'
  saveLoadElement.addEventListener('click', saveLoadPreset)
  addButton.addEventListener('click', addToList)
  setAsDefaultButton.addEventListener('click', setAsDefaultEvents)
  deletePresetButton.addEventListener('click', deletePreset)
  resetButton.addEventListener('click', async () => {
    const lastChance = confirm('Are you sure about resetting every data?')
    if (lastChance) {
      await resetData()
    }
  })
})
