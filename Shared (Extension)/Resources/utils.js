let isSafari

browser.checkSafari = async () => {
  if (isSafari === undefined) {
    try {
      const { isSafari: safari } = await browser.runtime.sendMessage({
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

browser.setSyncValue = async keys => {
  if (await browser.checkSafari()) {
    const { error } = await browser.runtime.sendMessage({
      native: {
        setValue: keys
      }
    })
    if (error !== undefined) {
      throw new Error(error)
    }
  } else {
    await browser.storage.sync.set(keys)
  }
}

browser.getSyncValue = async keys => {
  if (await browser.checkSafari()) {
    const resp = await browser.runtime.sendMessage({
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
    return await browser.storage.sync.get(keys)
  }
}
