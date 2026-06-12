import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Warn on http:// URLs in string literals and prefer https://',
      recommended: false,
    },
    schema: [],
    messages: {
      noHttpUrl: 'Recommended "{{url}}" switch to HTTPS',
    },
  },
  create(context) {
    return {
      Literal(node) {
        if (node.value && typeof node.value === 'string' && node.value.startsWith('http:')) {
          context.report({
            node,
            messageId: 'noHttpUrl',
            data: { url: node.value },
          });
        }
      },
    };
  },
};

export default rule;
