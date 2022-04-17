import { IMatcherFunction, IStyleAPI, IStyleItem } from 'import-sort-style';

export interface IImportSortStylePantaOptions {
  cssPatterns?: (string | RegExp)[];
  additionalCssPatterns?: (string | RegExp)[];
  imagePatterns?: (string | RegExp)[];
  additionalImagePatterns?: (string | RegExp)[];
}

export const DEFAULT_OPTIONS: IImportSortStylePantaOptions = {
  cssPatterns: [/\.css$/i, /\.scss$/i, /\.less$/i],
  imagePatterns: [/\.png$/i, /\.gif$/i, /\.svg$/i, /\.jpe?g$/i],
};

function preparePatternMatcher(
  patterns: (string | RegExp)[],
  additionalPatterns: (string | RegExp)[] = []
): IMatcherFunction {
  const regexes: RegExp[] = [];
  for (const list of [patterns, additionalPatterns]) {
    if (!list) {
      continue;
    }

    for (const item of list) {
      regexes.push(typeof item === 'string' ? new RegExp(item, 'i') : item);
    }
  }

  return i => {
    for (const regex of regexes) {
      if (regex.test(i.moduleName)) {
        return true;
      }
    }
    return false;
  };
}

export default function (
  styleApi: IStyleAPI,
  _file: string,
  providedOptions?: IImportSortStylePantaOptions
): IStyleItem[] {
  const options = providedOptions ? { ...DEFAULT_OPTIONS, ...providedOptions } : DEFAULT_OPTIONS;
  const cssMatcher = preparePatternMatcher(options.cssPatterns, options.additionalCssPatterns);
  const imageMatcher = preparePatternMatcher(
    options.imagePatterns,
    options.additionalImagePatterns
  );

  const {
    alias,
    and,
    dotSegmentCount,
    hasNoMember,
    isAbsoluteModule,
    isNodeModule,
    isRelativeModule,
    moduleName,
    naturally,
    unicode,
    not,
    or,
  } = styleApi;

  const notCssOrImage = not(or(cssMatcher, imageMatcher));

  return [
    // import x from './x.css'
    {
      match: cssMatcher,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import "foo"
    { match: and(hasNoMember, isAbsoluteModule, notCssOrImage) },
    { separator: true },

    // import "./foo"
    { match: and(hasNoMember, isRelativeModule, notCssOrImage) },
    { separator: true },

    // import … from "fs";
    {
      match: and(isNodeModule, notCssOrImage),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import … from "foo";
    {
      match: and(isAbsoluteModule, notCssOrImage),
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import … from "./foo";
    // import … from "../foo";
    {
      match: and(isRelativeModule, notCssOrImage),
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    { separator: true },

    // import x from './x.png'
    {
      match: imageMatcher,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: true },
  ];
}
