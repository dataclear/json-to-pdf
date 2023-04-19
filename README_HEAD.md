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