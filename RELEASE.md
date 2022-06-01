# Releasing a new version

1. Merge your changes to master and be on `master`
2. Run `npm version <major|minor|patch>`
   1. This builds the distribution file `gcc-output-parser.min.js`.
3. Push to origin `git push --follow-tags`
4. CircleCI will publish the npm package to the `latest` tag
5. Point your project to the new version `npm install gcc-output-parser@latest`


