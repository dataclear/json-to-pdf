## Constants

<dl>
<dt><a href="#getObjectValue">getObjectValue</a> ⇒ <code>*</code></dt>
<dd><p>Extracts a value from an object based on a string or array of paths
Inflates a set of fixed formula names with processed values</p>
</dd>
<dt><a href="#getTemplateLiteral">getTemplateLiteral</a> ⇒ <code>string</code></dt>
<dd><p>Extracts a literal value by removing double curly braces</p>
</dd>
<dt><a href="#nestedKeyValue">nestedKeyValue</a> ⇒ <code>*</code></dt>
<dd><p>Recursively iterates through object to find given key and returns value</p>
</dd>
<dt><a href="#functionifyHeaderFooter">functionifyHeaderFooter</a> ⇒ <code>unknown</code></dt>
<dd><p>Finds fixed formula value within object and replaces with a function that replaces the fixed value with a live function</p>
</dd>
<dt><a href="#isArrayFunction">isArrayFunction</a> ⇒ <code>boolean</code></dt>
<dd><p>Takes a string template and replaces template literals with the corresponding value from the &quot;data&quot; object</p>
</dd>
<dt><a href="#inflateLiterals">inflateLiterals</a> ⇒ <code>string</code></dt>
<dd><p>Takes a string template and replaces template literals with the corresponding value from the &quot;data&quot; object</p>
</dd>
<dt><a href="#processFunction">processFunction</a> ⇒ <code>unknown</code></dt>
<dd><p>Used to process array and logic functions, returns inflated data or undefined</p>
</dd>
<dt><a href="#processDataNode">processDataNode</a> ⇒ <code>unknown</code></dt>
<dd><p>Recursively moves through an object or individual element to replace literals, inflate data and process functions</p>
</dd>
</dl>

<a name="getObjectValue"></a>

## getObjectValue ⇒ <code>\*</code>
Extracts a value from an object based on a string or array of paths
Inflates a set of fixed formula names with processed values

**Kind**: global constant  
**Category**: Helper  
**Since**: v0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | The object to search |
| path | <code>string</code> \| <code>Array.&lt;string&gt;</code> | The path to traverse |

**Example**  
```js
getObjectValue({a: {b: {c: 1}}}, 'a.b.c')    //=> 1
getObjectValue({a: {b: {c: 1}}}, 'a.b.c.d')  //=> undefined
getObjectValue({a: {b: {c: 1}}}, 'a..b..c')  //=> undefined
getObjectValue({a: {b: {c: 1}}}, 'c')        //=> undefined
getObjectValue({a: {b: {c: [1,2,3]}}}, 'a.b.c.1')        //=> 2
getObjectValue({a: {b: {c: 6}}}, 'a.b.c.toFixed(2)')        //=> '6.00'
```
<a name="getTemplateLiteral"></a>

## getTemplateLiteral ⇒ <code>string</code>
Extracts a literal value by removing double curly braces

**Kind**: global constant  
**Category**: Helper  
**Since**: v0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>string</code> | The string to process |

**Example**  
```js
getTemplateLiteral('test')    //=> ''
getTemplateLiteral('{{test}}')    //=> 'test'
getTemplateLiteral('{{{test}}}')    //=> '{test}'
getTemplateLiteral('{{}}test')    //=> ''
getTemplateLiteral('{{}}')    //=> ''
```
<a name="nestedKeyValue"></a>

## nestedKeyValue ⇒ <code>\*</code>
Recursively iterates through object to find given key and returns value

**Kind**: global constant  
**Category**: Helper  
**Since**: v0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>\*</code> | The object to search |
| key | <code>\*</code> | The key to find |

**Example**  
```js
nestedKeyValue({a: {b: {c: 1}}}, 'c')  //=> 1
nestedKeyValue({a: {b: {c: 1}}}, 'd')  //=> undefined
nestedKeyValue({a: {b: {c: 1}}}, 'b')  //=> {c: 1}
```
<a name="functionifyHeaderFooter"></a>

## functionifyHeaderFooter ⇒ <code>unknown</code>
Finds fixed formula value within object and replaces with a function that replaces the fixed value with a live function

**Kind**: global constant  
**Category**: Helpers  
**Since**: v0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>unknown</code> | The current object node |
| data | <code>object</code> | The data to search for replacement values |
| settings | <code>Settings</code> | Settings to control how they are |

**Example**  
```js
processDataNode({test: '{{a}}'}, {a: 'b'}, {})    //=> {test: 'b'}
```
<a name="isArrayFunction"></a>

## isArrayFunction ⇒ <code>boolean</code>
Takes a string template and replaces template literals with the corresponding value from the "data" object

**Kind**: global constant  
**Category**: Helpers  
**Since**: v0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>object</code> | The object to look for array function key |

**Example**  
```js
isArrayFunction({a: 1, '{{#each a:b}}': {b: 2}, c: 3})    //=> true
isArrayFunction({a: 1, b: 2, c: 3})    //=> false
```
<a name="inflateLiterals"></a>

## inflateLiterals ⇒ <code>string</code>
Takes a string template and replaces template literals with the corresponding value from the "data" object

**Kind**: global constant  
**Category**: Main  
**Since**: v0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| template | <code>string</code> | The string to search and replace within |
| data | <code>object</code> | The data to search for replacement values |
| settings | <code>Settings</code> | Settings to control how they are |

**Example**  
```js
inflateLiterals('test', {}, {})    //=> 'test'
inflateLiterals('here is a {{val}}', {val: 'test'}, {})    //=> 'here is a test'
inflateLiterals('here is another {{val}}{{val}}', {val: 'test'}, {})    //=> 'here is a testtest'
inflateLiterals('here is a {{val.0}}', {val: ['test1', 'test2]}, {})    //=> 'here is a test1'
```
<a name="processFunction"></a>

## processFunction ⇒ <code>unknown</code>
Used to process array and logic functions, returns inflated data or undefined

**Kind**: global constant  
**Category**: Main  
**Since**: v0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| functionKey | <code>string</code> | The function to perform |
| object | <code>object</code> | The object to be inflated by the function |
| data | <code>object</code> | The data used to inflate the object |
| settings | <code>Settings</code> | Settings to control how items are processed |

**Example**  
```js
processFunction('{{#each items:item}}', {text: '{{item}}'}, {items: ['a', 'b', 'c']}, {})    //=> '[{text: 'a'},{text: 'b'},{text: 'c'}]'
```
<a name="processDataNode"></a>

## processDataNode ⇒ <code>unknown</code>
Recursively moves through an object or individual element to replace literals, inflate data and process functions

**Kind**: global constant  
**Category**: Main  
**Since**: v0.0.1  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>unknown</code> | The current object node |
| data | <code>object</code> | The data to search for replacement values |
| settings | <code>Settings</code> | Settings to control how they are |

**Example**  
```js
processDataNode({test: '{{a}}'}, {a: 'b'}, {})    //=> {test: 'b'}
```
