browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.native !== undefined) {
    return browser.runtime.sendNativeMessage(
      'xyz.helloyunho.Purity.Extension',
      request.native
    )
  }
})
