const defaultValue = {
  'bool': 'true',
  'DateTime': 'DateTime.Now',
  'var': 'null',
  'byte': '1',
  'string': 6,
  'int': Math.floor(100000 + Math.random() * 900000),
  'float': (Math.random() * 1000).toString().substring(0, 5),
}

const types = {
  'byte': defaultValue.byte,
  'sbyte': defaultValue.byte,
  'short': defaultValue.byte,
  'ushort': defaultValue.byte,
  'int': defaultValue.int,
  'uint': defaultValue.int,
  'long': defaultValue.int,
  'ulong': defaultValue.int,
  'float': defaultValue.float,
  'double': defaultValue.float,
  'decimal': defaultValue.float,
  'char': `'${Math.random().toString(36).substr(2, 1)}'`,
  'bool': defaultValue.bool,
  'object': 'new object()',
  'string': `"${Math.random().toString(36).substr(2, defaultValue.string)}"`,
  'DateTime': defaultValue.DateTime,
  'boolean': defaultValue.bool,
  'var': 'null',
};

const constructor = {
  scope: '(public|private|protected|internal|private protected|private interna|protected internal|)',
  type: '([a-zA-Z<> ,]+)',
  name: '([a-zA-Z_0-9]+)',
  variable: () => `${constructor.scope}${constructor.type}[\s]+${constructor.name}`
}

const regex = [
  {
    // class
    pattern: /(?:public|private|protected|internal|private protected|private internal|)[\s]+class[\s]+(.*)/gmi,
    module: ['class']
  },
  {
    // variable without [get set]
    pattern: /(?:private|public|internal|protected|protected internal|private protected|)([a-zA-Z<> ,]+)[\s]+([a-zA-Z_0-9]+)[\s]*;[\s]*/gmi,
    module: ['variable'],
  },
  {
    // variable with [get set]
    pattern: /(?:private|public|internal|protected|protected internal|private protected|)([a-zA-Z<> ,]+)[\s]+([a-zA-Z_0-9]+)[\s]*{[\s]*get;[\s]*set;[\s]*}[\s]*(?:=(.*?);|)/gmi,
    module: ['variable'],
  },
  {
    // variable with [get function, set function]
    pattern: /(?:private|public|internal|protected|protected internal|private protected|)([a-zA-Z<> ,]+)[\s]+([a-zA-Z_0-9]+)[\s]*{[\s]*get[\s]*{(?:.*?)}[\s]*set[\s]*{(?:.*?)}[\s]*}[\s]*/gmi,
    module: ['variable'],
  }
];

let variables = [];
let className = '';

const modules = {
  variable: (value, item) => {
    let match = modules.defined(new RegExp(item.pattern).exec(modules.clear(value)));

    let [full, type, name, variable] = modules.trim(match);

    const varData = types[type] || `new ${type}()`;

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

  variables.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

  return `new ${className}() \n{\n${variables.map(item => `${item.name} = ${item.data},`).join('\n')}\n}`;

}