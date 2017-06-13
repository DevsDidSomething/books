export const createWebString = (text) => {
  if (text.length > 50) {
    text = text.substring(0,50)
  }
  text = text.replace(/\s/g, '-')
  text = encodeURIComponent(text)
  return text
}

export const randId = () => {
  return Math.random().toString(36).substr(2, 5)
}
