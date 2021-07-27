module.exports = {
	"extends": [
		"airbnb-base",
		"eslint:recommended",
	],
	parser: "babel-eslint",

	"ignorePatterns": ["**/vendor/**"],

	"env": {
		"browser": true,
		"node": true,
		"es6": true,
	},

	"globals": {
		"$": true,
		"webpack.config": false,
	},

	"plugins": [
		"babel",
		"import",
	],

	settings: { 
		"import/resolver": {
			"webpack": {
				"config": {
					"resolve": {
						"modules": ["node_modules"],
						"extensions": [
							'.js',
						],
					},
				},
			},
		},
	},

	"rules": {
		"arrow-parens": 0,
		"brace-style": [1, "stroustrup", { "allowSingleLine": true }],
		"comma-dangle": 1,
		"eol-last": 1,
		"func-names": 0,
		"id-length": 0,
		"import/extensions": 0,
		"import/no-cycle": 0,
		"import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
		"import/no-named-as-default": 0,
		"import/no-named-as-default-member": 0,
		"import/prefer-default-export": 0,
		"indent": [1, "tab", { "SwitchCase": 1 }],
		"linebreak-style": 0,
		"max-classes-per-file": 0,
		"max-len": [2, 300, 2],
		"new-cap": 1,
		"no-case-declarations": 0,
		"no-console": 0,
		"no-continue": 0,
		"no-else-return": 0,
		"no-mixed-operators": 0,
		"no-plusplus": 0,
		"no-prototype-builtins": 0,
		"no-restricted-syntax": ["error", "WithStatement", "LabeledStatement"],
		"no-tabs": "off",
		"no-underscore-dangle": 2,
		"no-use-before-define": 0,
		"no-useless-computed-key": 0,
		"object-curly-newline": 0,
		"object-curly-spacing": [2, "always"],
		"object-property-newline": 0,
		"padded-blocks": 0,
		"prefer-object-spread": 0,
		"prefer-template": 2,
		"quote-props": 1,
		"space-in-parens": 1,
		"spaced-comment": ["error", "always", { "markers": ["/"] }],
	},
};
