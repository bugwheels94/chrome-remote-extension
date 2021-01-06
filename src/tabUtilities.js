export const getAllTabs = async () => {
  const windows = await getWindows()
  let result = []
  await Promise.all(windows.map(async (window) => {
    const tabs = await getTabsByWindow(window.id)
    result = [...result, ...tabs]
  }))
  return result
}
const getWindows = () => {
  return new Promise((resolve, reject) => {
    chrome.windows.getAll(resolve)
  }) 
}
const getTabsByWindow = (windowId) => {
  return new Promise((resolve, reject) => {
    chrome.tabs.getAllInWindow(windowId, (tabs) => {
      resolve(tabs)
    })
  }) 
}