# pinecast-js

This is all of the Pinecast JavaScript components.

## Setup

```sh
npm install
lerna bootstrap
```

## Packaging the omnibus:

```sh
cd packages/omnibus
npm run build
# use `npm run dev` instead to start a watcher
```

Note that you don't need to run `prepublish` on any of the packages, since omnibus's webpack is configured to use `jsnext:main` in the `package.json` files, which references the ES6 sources.

The output will be in `packages/omnibus/build/` and can be copied to the `pinecast/static/js/` directory. If it's a backwards-incompatible change, don't forget to update the cache buster in `base.html`.

## Rebuilding dependencies:

```sh
rm packages/*/package-lock.json && lerna clean && lerna bootstrap
```

## Hard-rebuilding dependencies:

```sh
rm packages/*/package-lock.json && lerna clean && rm -rf node_mododules && npm i && lerna bootstrap
```
