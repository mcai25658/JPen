import axios from 'axios';
import * as esbuild from 'esbuild-wasm';
import localforage from 'localforage';

const fileCaChe = localforage.createInstance({
  name: 'jBook-cache',
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /^index\.js$/ }, () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args) => {
        const cache = await fileCaChe.getItem<esbuild.OnLoadResult>(args.path);
        if (cache) return cache;
        return null;
      });

      build.onLoad({ filter: /.css$/ }, async (args) => {
        const { data, request } = await axios.get(args.path);

        const escaped = data.replace(/\n/g, '').replace(/"/g, '\\"').replace(/'/g, "\\'");
        const contents = `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
        `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCaChe.setItem(args.path, result);

        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCaChe.setItem(args.path, result);

        return result;
      });
    },
  };
};
