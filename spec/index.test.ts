import { sortImports } from 'import-sort';
import * as parser from 'import-sort-parser-typescript';

import importSortStylePanta from '../src/index';

describe('importSortStylePanta', () => {
  it('works as expected', () => {
    const code =
      `
import "./MyComponent.module.css";
import "../../global.css";

import {readFile, writeFile} from "fs";
import * as path from "path";

import aa from "aa";
import bb from "bb";
import cc from "cc";

import aaa from "../../aaa";
import bbb from "../../bbb";
import aaaa from "../aaaa";
import bbbb from "../bbbb";
import aaaaa from "./aaaaa";
import bbbbb from "./bbbbb";

import myLogo from '../../images/logo.png';
import exampleImage from './example.svg';

console.log('Some other code');`
        .split('\n')
        .sort(Math.random)
        .join('\n') +
      `
import "a";
import "c";
import "b";

import "./a";
import "./c";
import "./b";
`;

    const result = sortImports(code, parser, importSortStylePanta);

    expect(result.code.trim()).toEqual(
      `
import "../../global.css";
import "./MyComponent.module.css";

import "a";
import "c";
import "b";

import "./a";
import "./c";
import "./b";

import {readFile, writeFile} from "fs";
import * as path from "path";

import aa from "aa";
import bb from "bb";
import cc from "cc";

import aaa from "../../aaa";
import bbb from "../../bbb";
import aaaa from "../aaaa";
import bbbb from "../bbbb";
import aaaaa from "./aaaaa";
import bbbbb from "./bbbbb";

import myLogo from '../../images/logo.png';
import exampleImage from './example.svg';

console.log('Some other code');
`.trim()
    );
  });
});
