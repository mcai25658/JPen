import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // Handle root entry file of index.js
      // args.path === index.js
      build.onResolve({ filter: /(^index\.js$)/ }, (args) => {
        console.log(args);

        return { path: 'index.js', namespace: 'a' };
      });

      // Handle relative path in a module
      // args.path.includes('./') || args.path.includes('../')
      // "https://unpkg.com/nested-test-pkg@1.0.0/src/helpers/utils"
      build.onResolve({ filter: /^\.+\// }, (args) => {
        const path = new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href;
        return { path, namespace: 'a' };
      });

      // Handle main file of a module
      // https://unpkg.com/lodash
      build.onResolve({ filter: /.*/ }, async (args) => {
        return { path: `https://unpkg.com/${args.path}`, namespace: 'a' };
      });
    },
  };
};
