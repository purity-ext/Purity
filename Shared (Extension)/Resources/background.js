chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.native !== undefined) {
    return chrome.runtime.sendNativeMessage(
      'xyz.helloyunho.Purity.Extension',
      request.native
    )
  }
})
