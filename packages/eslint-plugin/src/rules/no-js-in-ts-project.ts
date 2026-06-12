import path from 'node:path';
import type { Rule } from 'eslint';

const JS_REG = /\.jsx?$/;

const DEFAULT_WHITE_LIST = [
  'commitlint.config.js',
  'eslint.config.js',
  'prettier.config.js',
  'stylelint.config.js',
  '.eslintrc.js',
  '.prettierrc.js',
  '.stylelintrc.js',
];

interface Options {
  whiteList?: string[];
  autoMerge?: boolean;
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Discourage .js/.jsx source files inside TS projects (config files are allowed)',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          whiteList: { type: 'array', items: { type: 'string' } },
          autoMerge: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noJSInTSProject: 'The "{{fileName}}" is not recommended in a TS project',
    },
  },

  create(context) {
    const fileName = context.filename;
    const extName = path.extname(fileName);
    const opts: Options = (context.options[0] as Options) ?? {};
    const userList = opts.whiteList ?? [];
    const autoMerge = opts.autoMerge ?? true;
    const whiteList =
      userList.length === 0
        ? DEFAULT_WHITE_LIST
        : autoMerge
          ? [...new Set([...DEFAULT_WHITE_LIST, ...userList])]
          : userList;
    const whiteListReg = new RegExp(`(${whiteList.join('|')})$`);

    return {
      Program(node) {
        if (!whiteListReg.test(fileName) && JS_REG.test(extName)) {
          context.report({
            node,
            messageId: 'noJSInTSProject',
            data: { fileName },
          });
        }
      },
    };
  },
};

export default rule;
