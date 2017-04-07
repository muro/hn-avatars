var avatars = {
  star: '',
  google: '',
  facebook: '',
  apple: '',
  microsoft: '',
  troll: '',
};

function apply_icon(name) {
  return function a(e) {
    var cl = e.parentElement.parentElement.classList;
    cl.add(name);
    cl.add('icon');
  };
}

function remove_icons(e) {
  var cl = e.parentElement.parentElement.classList;
  cl.remove('icon');

  Object.keys(avatars).forEach(function(key) {
    cl.remove(key);
  });
}

function apply_avatars() {
  chrome.storage.sync.get(avatars, function(items) {
    var all_names = document.querySelectorAll(
        'td.default span.comhead>a.hnuser');
    Array.prototype.map.call(all_names, remove_icons);

    for (var k in items) {
      var vals = items[k].split(',');
      for (var i = 0; i < vals.length; i++) {
        vals[i] = vals[i].trim();
      }

      filtered = Array.prototype.filter.call(
          all_names,
          function(e, _, _) {
            return vals.some(function(t, _, _) { return e.innerText == t; });
          });
      Array.prototype.map.call(filtered, apply_icon(k));
    }
  });
}

apply_avatars();

document.addEventListener('mousedown', function(event) {
  if (event.button != 2) {
    return;
  }

  if (event.path.length > 2 && event.path[0].nodeName.toLowerCase() === 'a' &&
      event.path[1].nodeName.toLowerCase() === 'span' &&
      event.path[1].className === 'comhead') {
    chrome.runtime.sendMessage({cmd: 'create_menu'});
  } else {
    chrome.runtime.sendMessage({cmd: 'delete_menu'});
  }
}, true);


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.cmd == 'refresh') {
        apply_avatars();
      }
    });
