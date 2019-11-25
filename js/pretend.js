(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global.Pretend = factory());
}(this, (function () {
  'use strict';

  // Class Name
  Pretend.class = '';

  // Class Variables
  Pretend.variables = [];

  // Settings
  Pretend.settings = {
    'bool': 'true',
    'DateTime': 'DateTime.Now',
    'var': 'null',
    'byte': '1',
    'string': 6,
    'int': () => Math.floor(100000 + Math.random() * 900000),
    'float': () => (Math.random() * 1000).toString().substring(0, 5),
    'sort': true
  }

  // Variable Types
  const types = {
    'byte': () => Pretend.settings.byte,
    'sbyte': () => Pretend.settings.byte,
    'short': () => Pretend.settings.byte,
    'ushort': () => Pretend.settings.byte,
    'int': () => Pretend.settings.int(),
    'uint': () => Pretend.settings.int(),
    'long': () => Pretend.settings.int(),
    'ulong': () => Pretend.settings.int(),
    'float': () => Pretend.settings.float(),
    'double': () => Pretend.settings.float(),
    'decimal': () => Pretend.settings.float(),
    'char': () => `'${Math.random().toString(36).substr(2, 1)}'`,
    'bool': () => Pretend.settings.bool,
    'object': () => 'new object()',
    'string': () => `"${Math.random().toString(36).substr(2, Pretend.settings.string)}"`,
    'DateTime': () => Pretend.settings.DateTime,
    'boolean': () => Pretend.settings.bool,
    'var': () => 'null',
  };

  const constructor = {
    scope: '(?:public|private|protected|internal|partial|private protected|private interna|protected internal)?',
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

  Pretend.patterns = regex.map(item => item.pattern);

  const modules = {
    variable: (value, item) => {
      let match = modules.defined(new RegExp(item.pattern).exec(modules.clear(value)));

      if (match) {
        let [full, type, name, variable] = modules.trim(match);

        const varData = (types[type] && types[type]()) || `new ${type}()`;

        Pretend.variables.push({
          name,
          type: type,
          data: variable || varData
        });
      }
    },
    class: (value, item) => {
      let match = modules.defined(new RegExp(item.pattern).exec(modules.clear(value)));

      if (match) {

        let [full, name] = modules.trim(match);

        Pretend.class = name.replace('{', '');

      }

    },
    defined: value => value && value.filter(item => (item)),
    trim: value => value && value.map(item => item.trim()),
    clear: value => value && value.trim().replace(/\n/g, ''),
  }


  function Pretend(code) {
    Pretend.variables = [];
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

    if (Pretend.settings.sort) {
      Pretend.variables.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    }

    return `new ${Pretend.class}() \n{\n${Pretend.variables.map(item => `${item.name} = ${item.data},`).join('\n')}\n}`;
  }

  Pretend.version = '1.0.4';

  return Pretend;
})));