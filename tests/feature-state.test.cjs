const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const {transformSync} = require('@babel/core');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');

const filename = path.resolve(__dirname, '../src/components/FeatureState/index.js');
const {code} = transformSync(fs.readFileSync(filename, 'utf8'), {
  filename,
  babelrc: false,
  configFile: false,
  plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
});
const exportsObject = {};
vm.runInNewContext(code, {exports: exportsObject});

test('upstream edition MDX tags render no commercial badges or upgrade links', () => {
  for (const Component of [exportsObject.default, exportsObject.Pro, exportsObject.Enterprise]) {
    for (const props of [{}, {edition: 'enterprise', since: '2.17'}, {feature: 'extended-rbac', inline: true, compact: true}]) {
      assert.equal(renderToStaticMarkup(React.createElement(Component, props)), '');
    }
  }
});
