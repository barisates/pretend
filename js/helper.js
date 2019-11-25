const helper = {
  sample: {
    property: [
      {
        name: 'OrderId',
        type: 'int'
      },
      {
        name: 'NumberOfItems',
        type: 'int'
      },
      {
        name: 'TotalAmount',
        type: 'float'
      },
      {
        name: 'Customer',
        type: 'string'
      },
      {
        name: 'OrderDate',
        type: 'DateTime'
      },
      {
        name: 'Delivered',
        type: 'bool'
      },
      {
        name: 'OrderHistory',
        type: 'List<History>'
      },
    ],
    code: () => `public class OrderDTO \n{\n${helper.sample.property.map(item => `public ${item.type} ${item.name} { get; set; }`).join('\n')}\n}`,
  },
  copyToClipboard: text => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  },
  copied: (item, text) => {
    item.getElementsByClassName('tooltiptext')[0].innerText = 'Copied';

    setTimeout(function () {
      item.getElementsByClassName('tooltiptext')[0].innerText = text;
    }, 200);
  },
  settings: {
    load: () => {
      if (window.localStorage) {
        let storedSettings = window.localStorage.getItem('pretend-settings');

        if (storedSettings !== null) {
          storedSettings = JSON.parse(storedSettings);

          Object.keys(storedSettings).forEach(item => {
            Pretend.settings[item] = storedSettings[item];
          });
        }
      }

      const items = document.getElementsByClassName('settings-item');

      for (let item of items) {
        item.value = Pretend.settings[item.dataset.key];
      }
    },
    save: () => {
      if (window.localStorage) {
        window.localStorage.setItem('pretend-settings', JSON.stringify(Pretend.settings));
      }
    }
  }
};

CodeMirror.prototype.FormatDocument = function (e) {
  this.execCommand('selectAll');
  this.indentSelection("smart");
  this.setCursor({ line: 1, ch: 1 });
};

helper.settings.load();