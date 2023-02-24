# cooltree

### What to Use cooltree for and When to Use It
This is a very cool JS open source framework, which is applicable to the development of H5 applications or H5 games (supporting wechat applets). The same project can freely switch between canvas mode and DOM mode display. It has many simple and practical UI components built in. It does not need to understand CSS, and it can also layout pages. It is compatible with all browsers except IE8 and below. At the same time, the framework supports sprite animation, bitmap fonts, external font loading, SVG graphics display, SVG graphics mask, multimedia playback, and browsing in wechat on mobile terminals.

### Learn ###
- Website: Find out more about cooltree on the  [official website](http://cooltree.cn)
- Docs: Get to know the cooltree  API by checking out the [docs](http://cooltree.cn/jsdoc/index.html).
- Examples: Get stuck right in and play around with cooltree  code and features right [here](http://cooltree.cn/game.html).
- E-mail:contact me  [here](mailto:ouye@163.com).

## Embed Html

```html
<script type="text/javascript" src="bin/cooltree_min.js" ></script>
```
```js
const {Stage,Global} = ct
//or
const stage=new ct.Stage();
```

## NPM Install

```sh
npm i cooltree -S
```

## Quickstart

#### import class

```js
import {Stage,Global} from 'cooltree'
```

#### import library

```js
import * as ct from 'cooltree'

const stage=new ct.Stage();
```

#### change display mode

```js
// * true canvas mode
// * false DOM mode
Global.useCanvas=true;
```

(https://github.com/ouyecw/cooltree.git)
