let isSafari

chrome.checkSafari = async () => {
  if (isSafari === undefined) {
    try {
      const { isSafari: safari } = await chrome.runtime.sendMessage({
        native: {
          isSafari: ''
        }
      })
      isSafari = safari ?? false
    } catch (err) {
      isSafari = false
    } finally {
      return isSafari
    }
  } else {
    return isSafari
  }
}

chrome.setSyncValue = async keys => {
  if (await chrome.checkSafari()) {
    const { error } = await chrome.runtime.sendMessage({
      native: {
        setValue: keys
      }
    })
    if (error !== undefined) {
      throw new Error(error)
    }
  } else {
    await chrome.storage.sync.set(keys)
  }
}

chrome.getSyncValue = async keys => {
  if (await chrome.checkSafari()) {
    const resp = await chrome.runtime.sendMessage({
      native: {
        getValue: keys
      }
    })
    if (resp.error !== undefined) {
      throw new Error(error)
    } else {
      return resp
    }
  } else {
    return await chrome.storage.sync.get(keys)
  }
}
