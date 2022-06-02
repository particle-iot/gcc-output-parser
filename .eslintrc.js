module.exports = {
	extends: ['eslint-config-particle'],
	parserOptions: {
		ecmaVersion: 2017,
		sourceType: 'module'
	},
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true,
		mocha: true,
		worker: true,
		serviceworker: true
	},
	ignorePatterns: ['dist']
};
