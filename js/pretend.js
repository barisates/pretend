const pretendSettings = {
  'bool': 'true',
  'DateTime': 'DateTime.Now',
  'var': 'null',
  'byte': '1',
  'string': 6,
  'int': () => Math.floor(100000 + Math.random() * 900000),
  'float': () => (Math.random() * 1000).toString().substring(0, 5),
  'sort': true
}

const types = {
  'byte': () => pretendSettings.byte,
  'sbyte': () => pretendSettings.byte,
  'short': () => pretendSettings.byte,
  'ushort': () => pretendSettings.byte,
  'int': () => pretendSettings.int(),
  'uint': () => pretendSettings.int(),
  'long': () => pretendSettings.int(),
  'ulong': () => pretendSettings.int(),
  'float': () => pretendSettings.float(),
  'double': () => pretendSettings.float(),
  'decimal': () => pretendSettings.float(),
  'char': () => `'${Math.random().toString(36).substr(2, 1)}'`,
  'bool': () => pretendSettings.bool,
  'object': () => 'new object()',
  'string': () => `"${Math.random().toString(36).substr(2, pretendSettings.string)}"`,
  'DateTime': () => pretendSettings.DateTime,
  'boolean': () => pretendSettings.bool,
  'var': () => 'null',
};

const constructor = {
  scope: '(?:public|private|protected|internal|private protected|private interna|protected internal)?',
  type: '([a-zA-Z<> ,]+)',
  name: '([a-zA-Z_0-9]+)',
  variable: () => `${constructor.scope}${constructor.type}[\\s]+${constructor.name}`
}

const regex = [
  {
    // class
    pattern: new RegExp(`${constructor.scope}[\\s]+class[\\s]+(.*)`, 'gmi'),
    module: ['class']
  },
  {
    // variable without [get set]
    pattern: new RegExp(`${constructor.variable()}[\\s]*;[\\s]*`, 'gmi'),
    module: ['variable'],
  },
  {
    // variable with [get set]
    pattern: new RegExp(`${constructor.variable()}[\\s]*{[\\s]*get;[\\s]*set;[\\s]*}[\\s]*(?:=(.*?);|)`, 'gmi'),
    module: ['variable'],
  },
  {
    // variable with [get function, set function]
    pattern: new RegExp(`${constructor.variable()}[\\s]*{[\\s]*get[\\s]*{(?:\\s*.*?\\s*)}[\\s]*set[\\s]*{(?:\\s*.*?\\s*)}[\\s]*}[\\s]*`, 'gmi'),
    module: ['variable'],
  }
];

let variables = [];
let className = '';

const modules = {
  variable: (value, item) => {
    let match = modules.defined(new RegExp(item.pattern).exec(modules.clear(value)));

    let [full, type, name, variable] = modules.trim(match);

    const varData = (types[type] && types[type]()) || `new ${type}()`;

    variables.push({
      name,
      data: variable || varData
    });
  },
  class: (value, item) => {
    let match = modules.defined(new RegExp(item.pattern).exec(modules.clear(value)));

    let [full, name] = modules.trim(match);

    className = name;
  },
  defined: value => value.filter(item => (item)),
  trim: value => value.map(item => item.trim()),
  clear: value => value.trim().replace(/\n/g, ''),
}


function Pretend(code) {
  variables = [];
  const codeText = code.trim();

  regex.forEach(item => {
    const match = codeText.match(item.pattern);

    if (match) {
      match.forEach(matchItem => {
        item.module.forEach(module => {
          modules[module](matchItem, item);
        });
      });
    }
  });

  if (pretendSettings.sort){
    variables.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
  }

  return `new ${className}() \n{\n${variables.map(item => `${item.name} = ${item.data},`).join('\n')}\n}`;
}