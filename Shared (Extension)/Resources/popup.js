const removeFromList = async event => {
  const parent = event.target.parentElement
  const eventID = parent.getAttribute('data-event')

  const { blockedEvents } = await browser.getSyncValue({
    blockedEvents: {}
  })
  const [url] = await browser.tabs.query({
    active: true,
    currentWindow: true
  })
  if (blockedEvents[url] !== undefined) {
    blockedEvents[url] = blockedEvents[url].filter(evt => evt !== eventID)
  }
  await browser.setSyncValue({
    blockedEvents
  })
}
