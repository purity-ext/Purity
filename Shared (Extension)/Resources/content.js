let isSafari

window.addEventListener(
  'contextmenu',
  event => {
    event.stopPropagation()
  },
  true
)

const checkSafari = () => {
  const resp = browser.runtime.sendNativeMessage('')
  resp.then(
    ({ isSafari: safari }) => {
      isSafari = safari ?? false
    },
    () => {
      isSafari = false
    }
  )
}

document.addEventListener('DOMContentLoaded', () => {
  const removeAttr = element => {
    if (element.children !== undefined) {
      element.removeAttribute('oncontextmenu')
    }
    if (element.children !== undefined && element.children.length !== 0) {
      for (const child in element.children) {
        removeAttr(child)
      }
    }
  }

  removeAttr(document.body)
})
