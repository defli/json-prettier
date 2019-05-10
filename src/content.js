import './content.css';
const NAME = "JsonBeatufier";

const BTN_TOGGLE = 'jw-btn-toggle';
const DOTS = 'jw-dots';
const COLLAPSED = 'jw-collapsed';
const VIEWER = 'jw-viewer';
const BODY = 'jw-body';
const BODY_ACTIVE = 'jw-body--active';
const PRE = 'jw-pre';

const bindToggleClick = () => {
  document.addEventListener('click', evt => {
    const $elm = evt.target;
    const $classList = $elm.parentNode.classList;
    const hasClass = params => $elm.classList.contains(params);
  
    if (!hasClass(BTN_TOGGLE) && !hasClass(DOTS)) {
      return;
    }

    if (!$classList.contains(COLLAPSED)) {
      $classList.add(COLLAPSED);
    } else {
      $classList.remove(COLLAPSED);
    }
  });
}

const appendScript = (json) => {
  const tag = document.createElement('script');
  const script = `window.LOG = ${JSON.stringify(json)}`;
  const txt = document.createTextNode(script);
  tag.appendChild(txt);
  document.body.appendChild(tag);
}

const prepare = (content) => {
  const port = chrome.runtime.connect({name: 'jsonbeauty'});
  port.postMessage({body: content});
  port.onMessage.addListener(function(msg) {
    switch (msg.type) {
      case 'preparing': 
        console.log(NAME.toUpperCase() + ': JSON is processing...');
        break;

      case 'invalid':
        document.body.classList.remove(BODY);
        document.body.firstChild.classList.remove(PRE);
        break;
      case 'ready':
        console.log(NAME.toUpperCase() + ': JSON is ready, type "LOG" for preview in console.');

        const node = document.createElement('div');

        node.classList.add(VIEWER);
        node.innerHTML = msg.body;
        document.body.appendChild(node);
        appendScript(msg.json);
        break;
    }
  });
};

const onLoad = () => {
  const firstChild = document.body.firstChild;
  const nodeName = firstChild.nodeName.toLowerCase();

  if (!nodeName === 'pre' || document.body.childElementCount != 1) {
    return;
  };

  document.body.classList.add(BODY);
  firstChild.classList.add(PRE);

  const content = firstChild.innerText;
  prepare(content);
  bindToggleClick();
};

document.addEventListener("DOMContentLoaded", onLoad, false);
