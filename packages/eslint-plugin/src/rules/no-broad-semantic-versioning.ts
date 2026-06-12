import path from 'node:path';
import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid broad semver ranges (*, x, >) in package.json dependencies',
      recommended: false,
    },
    schema: [],
    messages: {
      noBroadSemanticVersioning:
        'The "{{dependencyName}}" is not recommended to use "{{versioning}}"',
    },
  },

  create(context) {
    if (path.basename(context.filename) !== 'package.json') {
      return {};
    }

    return {
      Property(node) {
        const keyValue = node.key.type === 'Literal' ? node.key.value : undefined;
        if (keyValue !== 'dependencies' && keyValue !== 'devDependencies') {
          return;
        }
        if (node.value.type !== 'ObjectExpression') {
          return;
        }

        for (const property of node.value.properties) {
          if (property.type !== 'Property') continue;
          if (property.key.type !== 'Literal') continue;
          if (property.value.type !== 'Literal') continue;

          const dependencyName = String(property.key.value);
          const dependencyVersion = String(property.value.value);

          if (
            dependencyVersion.includes('*') ||
            dependencyVersion.includes('x') ||
            dependencyVersion.includes('>')
          ) {
            context.report({
              node: property,
              messageId: 'noBroadSemanticVersioning',
              data: {
                dependencyName,
                versioning: dependencyVersion,
              },
            });
          }
        }
      },
    };
  },
};

export default rule;
