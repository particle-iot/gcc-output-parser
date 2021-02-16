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
# push the changes to GitHub
$ git push && git push --tags
```

After those steps, [create a new Release](https://github.com/particle-iot/gcc-output-parser/releases/new) to indicate the changes