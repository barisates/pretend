[![pretend](http://barisates.com/git/pretend/logo-fit.png "pretend")](http://barisates.com/pretend/ "pretend")
------------
Fill the c# class by random data.

![](https://img.shields.io/github/stars/barisates/pretend.svg) ![](https://img.shields.io/github/forks/barisates/pretend.svg) ![](https://img.shields.io/github/issues/barisates/pretend.svg)

#### Intro

Fill the c# classes with random data based on property types. It makes it easy to test your methods, api endpoints, and functions. We usually use this tool to fill data transfer objects (DTO) when writing unit tests.

Open **[Pretend](http://barisates.com/pretend/ "Pretend")** to try it out.

#### Features

- Indentation and Syntax Highlighting
- Supports Default Property Value
- Random Data Settings
- Sorts Class Properties by Name

![Pretend](http://barisates.com/git/pretend/pretend.jpg "Pretend")

#####  Usage Examples

The default values you define to properties are supported by [Pretend](http://barisates.com/pretend/ "Pretend").

```csharp
  public string Test { get; set; } = "Property Default";
```

A new instance is created for the list, dictionary, struct, enum, and class types.

```csharp
OrderHistory = new List<History>()
```

##### Dependencies

- [CodeMirror](https://codemirror.net/ "CodeMirror")
- [FontAwesome](https://fontawesome.com/ "FontAwesome")

##### License

The MIT License.

Barış Ateş - http://barisates.com
