# pinecast-js

To set up:

```sh
npm install
lerna bootstrap
python lerna_hoist.py
```

Packaging the omnibus:

```sh
cd packages/omnibus
npm run build
```

Note that you don't need to run `prepublish` on any of the packages, since omnibus's webpack is configured to use `jsnext:main` in the `package.json` files, which references the ES6 sources.

The output will be in `packages/omnibus/build/` and can be copied to the `pinecast/static/js/` directory. If it's a backwards-incompatible change, don't forget to update the cache buster in `base.html`.
