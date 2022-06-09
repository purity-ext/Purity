;(async () => {
  let [blockedEvents, isEnabled] = await browser.getValue(
    window.location.origin
  )
  if (!isEnabled) {
    return
  }

  if (blockedEvents === undefined) {
    const defaultValue = await browser.getValue('defaultValue')
    blockedEvents = defaultValue ?? []
    await browser.setValue({
      url: window.location.origin,
      blockedEvents
    })
  }

  for (const evt of blockedEvents) {
    window.addEventListener(
      evt,
      event => {
        event.stopPropagation()
      },
      true
    )
  }

  const removeAttr = element => {
    if (element.removeAttribute !== undefined) {
      for (const evt of blockedEvents) {
        element.removeAttribute(`on${evt}`)
      }
    }
    if (element.children !== undefined && element.children.length !== 0) {
      for (const child of element.children) {
        removeAttr(child)
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      removeAttr(document.body)
    })
  } else {
    removeAttr(document.body)
  }
})()
