Array.prototype.slice.call(document.querySelectorAll('.tabs.dynamic')).forEach(buildTabs);

function hide(elem) {
  elem.style.display = 'none';
}
function show(elem) {
  elem.style.display = 'block';
  Array.prototype.slice.call(elem.querySelectorAll('.CodeMirror')).forEach(cm => {
    cm.CodeMirror.refresh();
  });
}

function buildTabs(tabBar) {
  const allTabs = Array.prototype.slice.call(tabBar.querySelectorAll('li a[data-tab]'));

  function select(a, initial) {
    allTabs.forEach(tab => {
      if (tab === a) {
        return;
      }
      tab.parentNode.className = tab.parentNode.className.replace(/\s?selected/g, '');
      hide(document.querySelector(tab.getAttribute('data-tab')));
    });
    a.parentNode.className += ' selected';
    const tabName = a.getAttribute('data-tab');
    const tab = document.querySelector(tabName);
    show(tab);
    if (tabBar.getAttribute('data-no-history') !== null || initial) {
      return;
    }
    const hash = window.location.hash.substr(1).split(',');
    const hashPos = parseInt(tabBar.getAttribute('data-hash-pos') || 0, 10);
    hash[hashPos] = tabName.substr(5);
    window.history.replaceState(null, null, '#' + hash.slice(0, hashPos + 1).join(','));
  }

  tabBar.addEventListener('click', e => {
    let target = e.target;
    if (target === tabBar) {
      return;
    }
    while (!target.getAttribute('data-tab')) {
      target = target.parentNode;
      if (target === tabBar) {
        return;
      }
    }
    e.preventDefault();
    if (target.nodeName !== 'A') return;

    select(target);
  });

  let selected = null;
  if (window.location.hash) {
    const hash = window.location.hash.substr(1).split(',')[tabBar.getAttribute('data-hash-pos') || 0];
    selected =
      tabBar.querySelector('a[data-tab=".tab-' + hash + '"]') || tabBar.querySelector('a[data-tab=".' + hash + '"]');
  }
  if (!selected) {
    selected = tabBar.querySelector('li a[data-tab]');
  }
  select(selected, true);
}
