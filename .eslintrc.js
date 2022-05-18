module.exports = {
    extends: [
        'plugin:vue/recommended',
    ],
    rules: {
        'vue/multi-word-component-names': 'off',
        'comma-dangle': ['error', 'always-multiline'],
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
        'quote-props': ['error', 'as-needed', { 'unnecessary': false }],
        'semi': ['error', 'always'],
        'space-unary-ops': [2, {
            'overrides': {
                '!': true,
            },
        }],
        'operator-linebreak': [2, 'before'],
        'vue/attributes-order': ['error', {
            'alphabetical': true,
        }],
        'vue/component-name-in-template-casing': 'error',
        'vue/component-tags-order': ['error', {
            'order': ['template', 'script', 'style'],
        }],
        'vue/html-indent': ['warn', 4],
        'vue/script-indent': ['error', 4, { 'baseIndent': 1, 'switchCase': 1 }],
        'vue/max-attributes-per-line': ['error', {
            'singleline': 3,
        }],
        'vue/padding-line-between-blocks': 'error',

        // Surpress rules
        'vue/no-v-html': 0,
        'vue/no-mutating-props': 0,
        'vue/v-slot-style': 0,
        'vue/valid-v-slot': 0,
    },
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                indent: 'off',
            },
        },
    ],
};
