module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        'node': true,
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true,
        },
        'ecmaVersion': 'latest',
    },
    'plugins': [
        'react',
        '@typescript-eslint',
    ],
    'rules': {
        '@typescript-eslint/explicit-function-return-type': 'error',
        'react/react-in-jsx-scope': 'off',
    },
};
