const main = document.getElementById('main');
const inputEditor = document.getElementById('inputEditor');
const outputEditor = document.getElementById('outputEditor');

CodeMirror.prototype.FormatDocument = function (e) {
  this.execCommand('selectAll');
  this.indentSelection("smart");
  this.setCursor({ line: 1, ch: 1 });
};

const sample = {
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
  code: () => `public class OrderDTO \n{\n${sample.property.map(item => `public ${item.type} ${item.name} { get; set; }`).join('\n')}\n}`,
};

const codeMirrorSettings = {
  lineNumbers: true,
  matchBrackets: true,
  lineWrapping: true,
  styleActiveLine: true,
  value: sample.code(),
  mode: "text/x-csharp"
};

const inputCodeMirror = CodeMirror(inputEditor, codeMirrorSettings);
const outputCodeMirror = CodeMirror(outputEditor, codeMirrorSettings);



function PretendCode() {
  // Pretend Code
  const pretendCode = Pretend(inputCodeMirror.getDoc().getValue());
  inputCodeMirror.FormatDocument();

  outputCodeMirror.getDoc().setValue(pretendCode);
  outputCodeMirror.FormatDocument();
}


inputEditor.addEventListener('change', function () {
  PretendCode();
});

inputEditor.addEventListener('paste', function (e) {
  PretendCode();
});


PretendCode();


/* TOOLS */
const pretend = document.getElementById('pretend');
const copy = document.getElementById('copy');
const copyData = document.getElementById('copyData');
const sort = document.getElementById('sort');
const settings = document.getElementById('settings');

pretend.addEventListener('click', function (e) {

  e.preventDefault();

  PretendCode();

});

copy.addEventListener('click', function (e) {

  e.preventDefault();

  CopyToClipboard(outputCodeMirror.getDoc().getValue());

  copy.getElementsByClassName('tooltiptext')[0].innerText = 'Copied';

  setTimeout(function () {
    copy.getElementsByClassName('tooltiptext')[0].innerText = 'Copy';
  }, 200);

});

copyData.addEventListener('click', function (e) {

  e.preventDefault();

  const match = /(?<={)(\s*.*?\s*)+(?=})/gmi.exec(outputCodeMirror.getDoc().getValue())[0];

  CopyToClipboard(match);

  copyData.getElementsByClassName('tooltiptext')[0].innerText = 'Copied';

  setTimeout(function () {
    copyData.getElementsByClassName('tooltiptext')[0].innerText = 'Copy Only Data';
  }, 200);

});

sort.addEventListener('click', function (e) {

  e.preventDefault();
  sort.classList.toggle("select");

  pretendSettings.sort = sort.classList.contains("select");

  PretendCode();
});

settings.addEventListener('click', function (e) {

  e.preventDefault();

  if (e.target.classList.contains('fas') ||
    e.target.classList.contains('tooltip'))
    settings.classList.toggle("select");

});

const SettingsBoolean = document.getElementById('SettingsBoolean');
const SettingsDateTime = document.getElementById('SettingsDateTime');
const SettingsVar = document.getElementById('SettingsVar');
const SettingsByte = document.getElementById('SettingsByte');
const SaveSettings = document.getElementById('SaveSettings');


SaveSettings.addEventListener('click', function(e) {

  pretendSettings.bool = SettingsBoolean.value;
  pretendSettings.DateTime = SettingsDateTime.value;
  pretendSettings.var = SettingsVar.value;
  pretendSettings.byte = SettingsByte.value;

  PretendCode();

  settings.classList.toggle("select");
});



function CopyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

