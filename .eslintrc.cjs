module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  ignorePatterns: ['dist', '.eslintrc.cjs', "node_modules", "dist", "build"],
  plugins: ['react-refresh',"react", "prettier", "import"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    "airbnb"
  ], 
  parserOptions: {
      ecmaVersion: 'latest',
      sourceType: "module",
      ecmaFeatures: {
          "jsx": true
      }
    },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "indent": ["error", 2, {"SwitchCase" : 1, "ObjectExpression": 1}],
    "prettier/prettier": "error",
    "linebreak-style": [0, "unix"],
    "quotes": ["error", "single", { "avoidEscape": true }],
    "semi": ["error", "always"],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": 0,
    "class-methods-use-this": ["error", { "enforceForClassFields": false }],
    "import/no-unresolved": [2, { "caseSensitive": false }],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "import/order": [
      2,
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always"
      }
    ]
  },
  ignorePatterns: [
    '*.cjs',
    'vite.config.js',
    'build/',
    'node_modules/',
  ],
  settings: {
    react: { version: '18.2' },
    "import/resolver": {
        'node': {
            "extensions": [".js", ".jsx", ".ts", ".tsx"],
            "moduleDirectory": ["node_modules", "src/"]
        }
    }
  }
}
