import Dumper from './json-dumper.js';

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "jsonbeauty");

  port.onMessage.addListener(function(msg) {
      const dump = new Dumper();
      port.postMessage({
        type: 'preparing'
      })

      let json;

      try {
        json = JSON.parse(msg.body);
      } catch (e) {
        json = null;
      }
      
      if (!json) {
        port.postMessage({
          type: 'invalid'
        });

        return false;
      }

      const content = dump.generateDump(json);

      port.postMessage({
        type: 'ready',
        body: content,
        json: json
      });
  });
});

