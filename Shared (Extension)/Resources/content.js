window.addEventListener(
  'contextmenu',
  event => {
    event.stopPropagation()
  },
  true
)

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
