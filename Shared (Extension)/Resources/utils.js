const defaultPresets = {
  Nothing: [],
  Blocked: ['contextmenu', 'copy', 'dragstart', 'selectstart']
}

browser.setValue = async ({
  blockedEvents,
  url,
  defaultValue,
  isEnabled,
  presetName
}) => {
  const result = {}
  if (presetName !== undefined) {
    result.presets = {
      [presetName]: blockedEvents
    }
  }
  if (blockedEvents !== undefined && url !== undefined) {
    result.blockedEvents = {
      [url]: blockedEvents
    }
  }
  if (isEnabled !== undefined && url !== undefined) {
    result.isEnabled = {
      [url]: isEnabled
    }
  }
  if (defaultValue !== undefined) {
    result.defaultValue = defaultValue
  }
  await browser.storage.local.set(result)
}

browser.getValue = async (key, preset = false) => {
  if (key === 'defaultValue') {
    return (await browser.storage.local.get('defaultValue')).defaultValue
  } else if (key === 'presets') {
    return (await browser.storage.local.get({ presets: {} })).presets
  } else if (preset) {
    if (key === 'Default Blocked Events') {
      return (await browser.storage.local.get('defaultValue')).defaultValue
    }
    const { presets } = await browser.storage.local.get({ presets: {} })
    return presets[key] ?? defaultPresets[key]
  } else {
    const { blockedEvents, isEnabled } = await browser.storage.local.get({
      blockedEvents: {},
      isEnabled: {}
    })
    return [blockedEvents[key], isEnabled[key] ?? true]
  }
}
