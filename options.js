var avatars = {
  star: '',
  amazon: '',
  apple: '',
  facebook: '',
  google: '',
  microsoft: '',
  troll: '',
};

// Saves options to chrome.storage.sync.
function save_options() {
  var toSave = {};

  Object.keys(avatars).forEach(function(key) {
     toSave[key] = document.getElementById(key).value;
  });

  chrome.storage.sync.set(toSave, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get(avatars, function(items) {
    Object.keys(avatars).forEach(function(key) {
      document.getElementById(key).value = items[key];
    });
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
                                                 save_options);
