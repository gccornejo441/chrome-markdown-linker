const lastRequest = {}

function copy() {
  chrome.action.getPopup({}).then((result) => {
    console.log(`***********result: ${result}`)
    if (result && result.popup) {
      const popupWindow = result.popup;
      // Access the DOM elements within the popup window
      const element = popupWindow.document.querySelector('#myElement');
      // Manipulate the element or perform actions
      element.textContent = 'Hello, Popup!';
    }
  });
}


async function copyPage() {
  const [tab] = await chrome.tabs.query({ active: true });
  console.log(tab.id)
  chrome.tabs.sendMessage(tab.id, {greeting: "hello"})
}

function menuFunction(info, tab) {
  const message = { action: 'IMAGE_CLICKED' };
  chrome.tabs.sendMessage(tab.id, message, (resp) => {
  console.log(resp)
  })
}

chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
      id: "menuOptions", 
      title: "Copy link with markdown-format",
      contexts: ["image", "link", "page", "selection"],
  })
})

chrome.contextMenus.onClicked.addListener(menuFunction)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 2. A page requested user data, respond with a copy of `user`
  if (message.action === 'copyPage') {
    copyPage();
  } else {
    lastRequest = message;
  }
});
