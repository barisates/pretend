const inputEditor = document.getElementById('inputEditor');
const outputEditor = document.getElementById('outputEditor');

const codeMirrorSettings = {
  lineNumbers: true,
  matchBrackets: true,
  lineWrapping: true,
  styleActiveLine: true,
  value: helper.sample.code(),
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

function CloseWarning() {
  window.onbeforeunload = function() {
        return "Do you really want to leave application?";
 };
}


inputEditor.addEventListener('change', function () {
  PretendCode();
  CloseWarning();
});

inputEditor.addEventListener('paste', function (e) {
  PretendCode();
  CloseWarning();
});


PretendCode();


/* TOOLS */
const pretend = document.getElementById('pretend');
const copy = document.getElementById('copy');
const copyData = document.getElementById('copyData');
const sort = document.getElementById('sort');
const settings = document.getElementById('settings');
const save = document.getElementById('save');

pretend.addEventListener('click', function (e) {
  e.preventDefault();
  PretendCode();
});

copy.addEventListener('click', function (e) {
  e.preventDefault();
  helper.copyToClipboard(outputCodeMirror.getDoc().getValue());
  helper.copied(copy, 'Copy');
});

copyData.addEventListener('click', function (e) {
  e.preventDefault();

  const match = /(?<={)(\s*.*?\s*)+(?=})/gmi.exec(outputCodeMirror.getDoc().getValue())[0];

  helper.copyToClipboard(match);
  helper.copied(copyData, 'Copy Only Data');
});

sort.addEventListener('click', function (e) {
  e.preventDefault();
  sort.classList.toggle("select");

  Pretend.settings.sort = sort.classList.contains("select");

  helper.settings.save();

  PretendCode();
});

settings.addEventListener('click', function (e) {

  e.preventDefault();

  if (e.target.classList.contains('fas') ||
    e.target.classList.contains('tooltip'))
    settings.classList.toggle("select");
});

save.addEventListener('click', function (e) {

  const items = document.getElementsByClassName('settings-item');

  for (let item of items) {
    Pretend.settings[item.dataset.key] = item.value;
  }

  helper.settings.save();

  PretendCode();

  settings.classList.toggle("select");
});