# Releasing `gcc-output-parser`

```bash
# build the dist files
$ npm run build
# commit to git
$ git add . && git commit -m "Update the dist files"
# bump the package version
$ npm version <major|minor|patch>
# publish to npm
$ npm publish
```