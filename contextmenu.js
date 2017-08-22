var avatars = {
  star: '',
  amazon: '',
  apple: '',
  facebook: '',
  google: '',
  microsoft: '',
  troll: '',
};

function removeAvatar(l, item) {
  var a = l.split(',');
  index = a.indexOf(item);
  if (index > -1) {
    a.splice(index, 1);
  }
  return a.join();
}

function getClickHandler(avatar) {
  return function(info, tab) {
    var user = info.linkUrl.match(/\?.*id=([^&]+)/)[1];
    chrome.storage.sync.get(avatars, function(items) {
      Object.keys(avatars).forEach(function(key) {
        items[key] = removeAvatar(items[key], user);
      });

      if (avatar) {
        if (items[avatar]) {
          items[avatar] += ',' + user;
        } else {
          items[avatar] = user;
        }
      }
      chrome.storage.sync.set(items, function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {cmd: 'refresh'});
        });
      });
    });
  }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.cmd == 'create_menu') {
        chrome.contextMenus.removeAll(function() {
          var menuId = chrome.contextMenus.create({
            'title' : 'Avatar',
            'contexts' : ['link']
          });
          Object.keys(avatars).forEach(function(key) {
            chrome.contextMenus.create({
              'title': key.toUpperCase().charAt(0) + key.substring(1),
              'contexts': ['link'],
              'onclick': getClickHandler(key),
              'parentId': menuId
            });
          });
          chrome.contextMenus.create({
            'title': 'None',
            'contexts': ['link'],
            'onclick': getClickHandler(),
            'parentId': menuId
          });
        });
      } else if (request.cmd == 'delete_menu') {
        chrome.contextMenus.removeAll();
      }
    });
