import type { Rule } from 'eslint';

const DEFAULT_DANGEROUS_KEYS = ['secret', 'token', 'password'];

interface Options {
  dangerousKeys?: string[];
  autoMerge?: boolean;
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detect likely secret tokens assigned to commonly-sensitive identifiers',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          dangerousKeys: { type: 'array', items: { type: 'string' } },
          autoMerge: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noSecretInfo: 'Detect that the "{{secret}}" might be a secret token, please check!',
    },
  },

  create(context) {
    const opts: Options = (context.options[0] as Options) ?? {};
    const userKeys = opts.dangerousKeys ?? [];
    const autoMerge = opts.autoMerge ?? true;
    const dangerousKeys =
      userKeys.length === 0
        ? DEFAULT_DANGEROUS_KEYS
        : autoMerge
          ? [...new Set([...DEFAULT_DANGEROUS_KEYS, ...userKeys])]
          : userKeys;
    const reg = new RegExp(dangerousKeys.join('|'));

    return {
      Literal(node) {
        if (!node.value) return;
        const parent = (node as Rule.Node).parent;
        if (!parent) return;

        const matchesIdentifier = (name: string | undefined): boolean =>
          !!name && reg.test(name.toLocaleLowerCase());

        const isVarMatch =
          parent.type === 'VariableDeclarator' &&
          parent.id?.type === 'Identifier' &&
          matchesIdentifier(parent.id.name);

        const isPropMatch =
          parent.type === 'Property' &&
          parent.key?.type === 'Identifier' &&
          matchesIdentifier(parent.key.name);

        if (isVarMatch || isPropMatch) {
          context.report({
            node,
            messageId: 'noSecretInfo',
            data: { secret: String(node.value) },
          });
        }
      },
    };
  },
};

export default rule;
