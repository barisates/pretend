const main = document.getElementById('main');
const inputEditor = document.getElementById('inputEditor');
const outputEditor = document.getElementById('outputEditor');

const codeMirrorSettings = {
  lineNumbers: true,
  matchBrackets: true,
  lineWrapping: true,
  styleActiveLine: true,
  mode: "text/x-csharp"
};

const inputCodeMirror = CodeMirror(inputEditor, codeMirrorSettings);
const outputCodeMirror = CodeMirror(outputEditor, codeMirrorSettings);


inputEditor.addEventListener('paste', function (e) {
  FormatCodeMirror(inputCodeMirror);

  outputCodeMirror.getDoc().setValue(Pretend(inputEditor.innerText));
  FormatCodeMirror(outputCodeMirror);
});

outputEditor.addEventListener('paste', function (e) {
  e.preventDefault();
});


function FormatCodeMirror(mirror) {
  mirror.execCommand('selectAll');

  mirror.indentSelection("smart");

  mirror.setCursor({ line: 1, ch: 1 });
}

const defaultClass = {
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
  code: () => `public class OrderDTO \n{\n${defaultClass.property.map(item => `public ${item.type} ${item.name} { get; set; }`).join('\n')}\n}`,
};

inputCodeMirror.getDoc().setValue(defaultClass.code());
FormatCodeMirror(inputCodeMirror);

outputCodeMirror.getDoc().setValue(Pretend(inputEditor.innerText));
FormatCodeMirror(outputCodeMirror);

main.classList.add('opacity');