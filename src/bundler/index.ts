import * as esBuild from 'esbuild-wasm';

import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

const env = ['process', 'env', 'NODE_ENV'].join('.');

export const startService = async (): Promise<boolean> => {
  try {
    await esBuild.initialize({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.15.12/esbuild.wasm',
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

type Bundler = {
  code: string;
  err: string;
};

export const bundler = async (rawCode: string): Promise<Bundler> => {
  try {
    const result = await esBuild.build({
      bundle: true,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      entryPoints: ['index.js'],
      write: false,
      define: {
        [env]: '"production"',
        global: 'window',
      },
    });

    return {
      code: result?.outputFiles[0]?.text,
      err: '',
    };
  } catch (error) {
    return {
      code: '',
      err: error.message,
    };
  }
};
