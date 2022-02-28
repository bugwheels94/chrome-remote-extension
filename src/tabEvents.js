import { getAllTabs } from './tabUtilities'
export const initializeTabEvents = (socket) => {
  socket.on("createTab", ({ url }, callback) => {
    chrome.tabs.create({ url }, (tab) => {
      callback(tab)
    })  
  });
  socket.on("searchInTab", ({ id, value }, callback) => {
      if (isValidHttpUrl(value)) {
        chrome.tabs.update(id, { url: withHttp(value) }, callback)      
      } else {
        chrome.search.query({ tabId: id, text: value }, callback)
      }
  });
  socket.on("navigateTab", ({ id, direction }, callback) => {
    if (direction === 'forward') {
      chrome.tabs.goForward(id, callback)      
    } else {
      chrome.tabs.goBack(id, callback)      
    }
  });
  socket.on("zoom", ({ id, factor }, callback) => {
      chrome.tabs.getZoom(id, (zoomFactor) => {
        if (factor === 'in') {
          chrome.tabs.setZoom(id, zoomFactor + .1)      
        } else {
          chrome.tabs.setZoom(id, Math.max(0.2, zoomFactor - 0.1))      
        }
      })
  });
  socket.on("readHistory", (text, callback) => {
    chrome.history.search({ text }, (searchResults) => {
      callback(searchResults.map(result => ({
        label: result.title,
        value: result.url
      })))
    })  
  });
  socket.on("removeTab", ({ id }, callback) => {
    chrome.tabs.remove(id, callback)
  });
  socket.on("reloadTab", ({ id }, callback) => {
    chrome.tabs.reload(id, callback)  
  });
  socket.on("updateTab", ({ id, windowId }, newTab, callback) => {
    chrome.tabs.update(id, newTab, callback)
    if (newTab.active) {
      chrome.windows.update(windowId, {
        focused: true
      })
    }
  });
  socket.on("highlightTab", ({ id }, callback) => {
    chrome.tabs.highlight(id, callback)  
  });
  
  chrome.tabs.onUpdated.addListener((id, newTab, tab) => {
  
    socket.emit('updatedTab', {
      id,
      ...newTab
    })
  })
  chrome.tabs.onActivated.addListener(({ tabId }) => {
    socket.emit('activatedTab', {
      id: tabId,
      active: true
    })
  })
  chrome.tabs.onCreated.addListener((tab) => {
    socket.emit('createdTab', tab)
  })
  chrome.tabs.onRemoved.addListener((tabId) => {
    socket.emit('removedTab', {
      id: tabId
    })
  })
  socket.on('connect', async () => {
    const tabs = await getAllTabs()
    socket.emit('tvState', tabs)
  });
  socket.on('readTvState', async (callback) => {
    const tabs = await getAllTabs()
    callback(tabs)
  });
  
  // handle the event sent with socket.send()

  

}
  
function isValidHttpUrl(string) {
  var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return (res !== null)
}
function withHttp(url) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = "http://" + url;
  }
  return url;
}  
