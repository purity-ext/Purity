;(async () => {
  const { isEnabled } = await browser.getSyncValue({
    isEnabled: {}
  })
  if (!(isEnabled[window.location.origin] ?? true)) {
    return
  }

  const { blockedEvents } = await browser.getSyncValue({
    blockedEvents: {}
  })

  let events = blockedEvents[window.location.origin]
  if (blockedEvents[window.location.origin] === undefined) {
    const { defaultValue } = await browser.getSyncValue('defaultValue')
    events = defaultValue ?? []
    blockedEvents[window.location.origin] = events
    await browser.setSyncValue({ blockedEvents })
  }

  for (const evt of events) {
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
      for (const evt of events) {
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
