import { getAllTabs } from './tabUtilities'
export const initializeTabEvents = (socket) => {
  socket.on("createTab", ({ url }, callback) => {
    chrome.tabs.create({ url }, (tab) => {
      callback(tab)
    })  
  });
  socket.on("searchInTab", ({ id, value }, callback) => {
    console.log('Custom Search Received')
      if (isValidHttpUrl(value)) {
        console.log("Search by URL")
        chrome.tabs.update(id, { url: withHttp(value) }, callback)      
      } else {
        console.log("Search by Text")
        chrome.search.query({ tabId: id, text: value }, callback)
      }
  });
  socket.on("navigateTab", ({ id, direction }, callback) => {
    if (direction === 'forward') {
      console.log("Going forward")
      chrome.tabs.goForward(id, callback)      
    } else {
      console.log("Going Backward")
      chrome.tabs.goBack(id, callback)      
    }
  });
  socket.on("zoom", ({ id, factor }, callback) => {
      chrome.tabs.getZoom(id, (zoomFactor) => {
        if (factor === 'in') {
          console.log("Zoom in", zoomFactor)
          chrome.tabs.setZoom(id, zoomFactor + .1)      
        } else {
          console.log("Zoom out", zoomFactor)
          chrome.tabs.setZoom(id, Math.max(0.2, zoomFactor - 0.1))      
        }
      })
  });
  socket.on("readHistory", (text, callback) => {
    console.log('Read History Received for', text)
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
    console.log("Updating Tab", windowId, id, newTab)
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
    console.log('Updated', newTab, tab)
  
    socket.emit('updatedTab', {
      id,
      ...newTab
    })
  })
  chrome.tabs.onActivated.addListener(({ tabId }) => {
    console.log('Activated', tabId)
    socket.emit('activatedTab', {
      id: tabId,
      active: true
    })
  })
  chrome.tabs.onCreated.addListener((tab) => {
    console.log('Created', tab)
    socket.emit('createdTab', tab)
  })
  chrome.tabs.onRemoved.addListener((tabId) => {
    console.log('Removed', tabId)
    socket.emit('removedTab', {
      id: tabId
    })
  })
  socket.on('connect', async () => {
    const tabs = await getAllTabs()
    socket.emit('tvState', tabs)
  });
  socket.on('readTvState', async (callback) => {
    console.log('Remote wants to read State')
    const tabs = await getAllTabs()
    console.log('Emitting TV State', tabs)
    callback(tabs)
  });
  
  // handle the event sent with socket.send()
  socket.on('message', data => {
    console.log(data);
  });
  
  // handle the event sent with socket.emit()
  socket.on('greetings', (elem1, elem2, elem3) => {
    console.log(elem1, elem2, elem3);
  });
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
