browser.setValue = async ({ blockedEvents, url, defaultValue, isEnabled }) => {
  const result = {}
  if (blockedEvents !== undefined) {
    result.blockedEvents = {
      [url]: blockedEvents
    }
  }
  if (isEnabled !== undefined) {
    result.isEnabled = {
      [url]: isEnabled
    }
  }
  if (defaultValue !== undefined) {
    result.defaultValue = defaultValue
  }
  await browser.storage.local.set(result)
}

browser.getValue = async key => {
  if (key === 'defaultValue') {
    return (await browser.storage.local.get('defaultValue')).defaultValue
  } else {
    const { blockedEvents, isEnabled } = await browser.storage.local.get({
      blockedEvents: {},
      isEnabled: {}
    })
    return [blockedEvents[key], isEnabled[key] ?? true]
  }
}
