# import-sort-style-panta

A style for [import-sort](https://github.com/renke/import-sort).

Based on [import-sort-style-module](https://www.npmjs.com/package/import-sort-style-module), with the following changes:

- css files (`.css`, `.scss`, `.less`) are sent to the top.
- image imports (`.png`, `.svg`...) are sent to the bottom.

The rest of the rules work the same as in _import-sort-style-module_.

Example:

```js
// CSS Imports, the most distant last
import "../../global.css";
import styles from "./MyComponent.module.css";

// Absolute modules with side effects (not sorted because order may matter)
import "a";
import "c";
import "b";

// Relative modules with side effects (not sorted because order may matter)
import "./a";
import "./c";
import "./b";

// Modules from the Node.js "standard" library sorted by name
import {readFile, writeFile} from "fs";
import * as path from "path";

// Third-party modules sorted by name
import aa from "aa";
import bb from "bb";
import cc from "cc";

// First-party modules sorted by "relative depth" and then by name
import aaa from "../../aaa";
import bbb from "../../bbb";
import aaaa from "../aaaa";
import bbbb from "../bbbb";
import aaaaa from "./aaaaa";
import bbbbb from "./bbbbb";

// Images at the bottom, the most distant last
import myLogo from '../../images/logo.png';
import exampleImage from './example.svg';
```

You can add your own css and image regexes in the options.

- `cssPatterns`  
  Replacement patterns for imports that should be treated as "css"
- `additionalCssPatterns`  
  Additional patterns for imports that should be treated as "css"
- `imagePatterns`  
  Replacement patterns for imports that should be treated as "images"
- `additionalImagePatterns`  
  Additional patterns for imports that should be treated as "images"

Example in `package.json`:

```json
{
  "importSort": {
    ".ts, .tsx": {
      "style": "module",
      "parser": "typescript",
      "options": {
        "cssPatterns": ["\\.css$", "\\.stylus$"],
        "additionalImagePatterns": ["\\.tiff$"]
      }
    }
  }
}
```

Licence: **MIT**
