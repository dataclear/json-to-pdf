# json-to-pdf
Generates PDF documents using PDF-Make and a basic JSON templating system similar to handlebars.

## Usage

JSON templates are used which match the format of PDFMake document definition objects:

```json
{
  "pageSize":"A4",
  "pageOrientation":"portrait",
  "pageMargins":[25, 25, 25, 25],
  "content":[
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam.",
    {
      "text":"This text should appear on the second page",
      "pageBreak":"before"
    }
  ]
}
```

These templates can be expanded using data to create rich documents:

Template:
```json
{
  "pageSize":"A4",
  "pageOrientation":"portrait",
  "pageMargins":[25, 25, 25, 25],
  "content":[
    "{{loremipsum}}",
    {
      "text":"page2.text",
      "pageBreak":"before"
    }
  ]
}
```

Data:
```js
const data = {
  loremipsum: 'Lorem ipsum...naturam.',
  page2text: {
    text: 'This text should appear on the second page'
  }
}
```

Code:
```js
import * as jsonToPdf from 'jon-to-pdf';

const pdfStream = jsonToPdf.renderPdfTemplate(template, data);
const fileStream = createWriteStream('./example.pdf');
pdfStream.pipe(fileStream);
pdfStream.end();
```

There are several helpers available to expand the JSON templates.

## each
Repeats for each item in a supplied array

```json
[
  "{{#each lines:line}}": {
    "text": "{{line}}"
  }
]
```

With `data = ['a','b']` will inflate to:

```json
[
  {
    "text": "a"
  },
  {
    "text": "b"
  }
]
```

## if

Only includes value if supplied variable is truthy:
```json
{
  "{{#if test}}": {
    "text": "{{text}}"
  }
}
```
With `data = {test: true, text: 'show me'}` will inflate to:

```json
{
  "text": "show me"
}
```

## unless

Like if, but will include value if the supplied variable is falsy:
```json
{
  "{{#unless test}}": {
    "text": "{{text}}"
  }
}
```
With `data = {test: true, text: 'don\'t show me'}` will inflate to:

```json
{}
```


<br>

# API Documentation

## Functions

<dl>
<dt><a href="#functionifyHeaderFooter">functionifyHeaderFooter(node)</a> ⇒ <code>DynamicContent</code> | <code>Content</code></dt>
<dd><p>Finds fixed formula value within object and replaces with a function that replaces the fixed value with a live function</p></dd>
<dt><a href="#getObjectValue">getObjectValue(obj, path)</a> ⇒ <code>*</code></dt>
<dd><p>Extracts a value from an object based on a string or array of paths
Inflates a set of fixed formula names with processed values</p></dd>
<dt><a href="#getTemplateLiteral">getTemplateLiteral(val)</a> ⇒ <code>string</code></dt>
<dd><p>Extracts a literal value by removing double curly braces</p></dd>
<dt><a href="#isArrayFunction">isArrayFunction(element)</a> ⇒ <code>boolean</code></dt>
<dd><p>Takes a string template and replaces template literals with the corresponding value from the &quot;data&quot; object</p></dd>
<dt><a href="#nestedKeyValue">nestedKeyValue(obj, key)</a> ⇒ <code>*</code></dt>
<dd><p>Recursively iterates through object to find given key and returns value</p></dd>
<dt><a href="#inflateLiterals">inflateLiterals(template, data, settings)</a> ⇒ <code>string</code></dt>
<dd><p>Takes a string template and replaces template literals with the corresponding value from the &quot;data&quot; object</p></dd>
<dt><a href="#processDataNode">processDataNode(val, data, settings)</a> ⇒ <code>unknown</code></dt>
<dd><p>Recursively moves through an object or individual element to replace literals, inflate data and process functions</p></dd>
<dt><a href="#processFunction">processFunction(functionKey, object, data, settings)</a> ⇒ <code>unknown</code></dt>
<dd><p>Used to process array and logic functions, returns inflated data or undefined</p></dd>
<dt><a href="#renderPdfTemplate">renderPdfTemplate(docDefinition, data)</a> ⇒ <code>stream</code></dt>
<dd><p>Inflates a json template into a PDFMake document definition, then renders the definition to a PDF file</p></dd>
</dl>

<a name="functionifyHeaderFooter"></a>

## functionifyHeaderFooter(node) ⇒ <code>DynamicContent</code> \| <code>Content</code>
<p>Finds fixed formula value within object and replaces with a function that replaces the fixed value with a live function</p>

**Kind**: global function  
**Category**: Helpers  
**Since**: v0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>DynamicContent</code> \| <code>Content</code> | <p>The current object node</p> |

**Example**  
```js
processDataNode({test: '{{a}}'}, {a: 'b'}, {})    //=> {test: 'b'}
```

* * *

<a name="getObjectValue"></a>

## getObjectValue(obj, path) ⇒ <code>\*</code>
<p>Extracts a value from an object based on a string or array of paths
Inflates a set of fixed formula names with processed values</p>

**Kind**: global function  
**Category**: Helpers  
**Since**: v0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | <p>The object to search</p> |
| path | <code>string</code> \| <code>Array.&lt;string&gt;</code> | <p>The path to traverse</p> |

**Example**  
```js
getObjectValue({a: {b: {c: 1}}}, 'a.b.c')    //=> 1getObjectValue({a: {b: {c: 1}}}, 'a.b.c.d')  //=> undefinedgetObjectValue({a: {b: {c: 1}}}, 'a..b..c')  //=> undefinedgetObjectValue({a: {b: {c: 1}}}, 'c')        //=> undefinedgetObjectValue({a: {b: {c: [1,2,3]}}}, 'a.b.c.1')        //=> 2getObjectValue({a: {b: {c: 6}}}, 'a.b.c.toFixed(2)')        //=> '6.00'
```

* * *

<a name="getTemplateLiteral"></a>

## getTemplateLiteral(val) ⇒ <code>string</code>
<p>Extracts a literal value by removing double curly braces</p>

**Kind**: global function  
**Category**: Helpers  
**Since**: v0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>string</code> | <p>The string to process</p> |

**Example**  
```js
getTemplateLiteral('test')        //=> ''getTemplateLiteral('{{test}}')    //=> 'test'getTemplateLiteral('{{{test}}}')  //=> '{test}'getTemplateLiteral('{{}}test')    //=> ''getTemplateLiteral('{{}}')        //=> ''
```

* * *

<a name="isArrayFunction"></a>

## isArrayFunction(element) ⇒ <code>boolean</code>
<p>Takes a string template and replaces template literals with the corresponding value from the &quot;data&quot; object</p>

**Kind**: global function  
**Category**: Helpers  
**Since**: v0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>object</code> | <p>The object to look for array function key</p> |

**Example**  
```js
isArrayFunction({a: 1, '{{#each a:b}}': {b: 2}, c: 3})    //=> trueisArrayFunction({a: 1, b: 2, c: 3})    //=> false
```

* * *

<a name="nestedKeyValue"></a>

## nestedKeyValue(obj, key) ⇒ <code>\*</code>
<p>Recursively iterates through object to find given key and returns value</p>

**Kind**: global function  
**Category**: Helpers  
**Since**: v0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>\*</code> | <p>The object to search</p> |
| key | <code>\*</code> | <p>The key to find</p> |

**Example**  
```js
nestedKeyValue({a: {b: {c: 1}}}, 'c')  //=> 1nestedKeyValue({a: {b: {c: 1}}}, 'd')  //=> undefinednestedKeyValue({a: {b: {c: 1}}}, 'b')  //=> {c: 1}
```

* * *

<a name="inflateLiterals"></a>

## inflateLiterals(template, data, settings) ⇒ <code>string</code>
<p>Takes a string template and replaces template literals with the corresponding value from the &quot;data&quot; object</p>

**Kind**: global function  
**Category**: Main  
**Since**: v0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| template | <code>string</code> | <p>The string to search and replace within</p> |
| data | <code>object</code> | <p>The data to search for replacement values</p> |
| settings | <code>Settings</code> | <p>Settings to control how they are</p> |

**Example** *(Ignores plain text)*  
```js
inflateLiterals('test', {}, {})    //=> 'test'
```
**Example** *(Replaces one or more placeholders)*  
```js
inflateLiterals('here is a {{val}}', {val: 'test'}, {})    //=> 'here is a test'
inflateLiterals('here is another {{val}}{{val}}', {val: 'test'}, {})    //=> 'here is a testtest'
```
**Example** *(Can extract positional values from arrays)*  
```js
inflateLiterals('here is a {{val.1}}', {val: ['test1', 'test2']}, {})    //=> 'here is a test2'
```
**Example** *(Or will comma separate full arrays)*  
```js
inflateLiterals('here is a {{val}}', {val: ['test1', 'test2]}, {})    //=> 'here is a test1, test2'
```

* * *

<a name="processDataNode"></a>

## processDataNode(val, data, settings) ⇒ <code>unknown</code>
<p>Recursively moves through an object or individual element to replace literals, inflate data and process functions</p>

**Kind**: global function  
**Category**: Main  
**Since**: v0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>unknown</code> | <p>The current object node</p> |
| data | <code>object</code> | <p>The data to search for replacement values</p> |
| settings | <code>Settings</code> | <p>Settings to control how they are</p> |

**Example**  
```js
processDataNode({test: '{{a}}'}, {a: 'b'}, {})    //=> {test: 'b'}
```

* * *

<a name="processFunction"></a>

## processFunction(functionKey, object, data, settings) ⇒ <code>unknown</code>
<p>Used to process array and logic functions, returns inflated data or undefined</p>

**Kind**: global function  
**Category**: Main  
**Since**: v0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| functionKey | <code>string</code> | <p>The function to perform</p> |
| object | <code>object</code> | <p>The object to be inflated by the function</p> |
| data | <code>object</code> | <p>The data used to inflate the object</p> |
| settings | <code>Settings</code> | <p>Settings to control how items are processed</p> |

**Example**  
```js
processFunction('{{#each items:item}}', {text: '{{item}}'}, {items: ['a', 'b', 'c']}, {})    //=> '[{text: 'a'},{text: 'b'},{text: 'c'}]'
```

* * *

<a name="renderPdfTemplate"></a>

## renderPdfTemplate(docDefinition, data) ⇒ <code>stream</code>
<p>Inflates a json template into a PDFMake document definition, then renders the definition to a PDF file</p>

**Kind**: global function  
**Category**: Main  
**Since**: v0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| docDefinition | <code>ExpandableDocDefinition</code> | <p>The JSON string or object definition to inflate</p> |
| data | <code>object</code> | <p>The data to use for inflated values</p> |


* * *


<br>
<br>

&copy; 2023 Dataclear Ltd<br>
Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).