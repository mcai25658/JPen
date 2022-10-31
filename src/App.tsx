import * as esBuild from 'esbuild-wasm';
import { useEffect, useState, useRef } from 'react';

import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

const html = `
<html>
  <head></head>
  <body>
    <div id='root'></div>
    <script>
      window.addEventListener('message', (event) => {
        try {
          eval(event.data)
        } catch (error) {
          const root = document.querySelector('#root');
          root.innerHTML = 
          '<div style="color: red";><h4>Runtime Error</h4>' 
          + error + 
          '</div>'

          console.error(error)
        }
      }, false)
    </script>
  </body>
</html>
`;

export const App = () => {
  const [value, setValue] = useState('');

  const iframeRef = useRef<any>();

  const [initialized, setInitialized] = useState(false);

  const startService = async () => {
    if (initialized) return;
    try {
      await esBuild.initialize({
        worker: true,
        // wasmURL: '/public/esbuild.wasm',
        wasmURL: 'https://unpkg.com/esbuild-wasm@0.15.12/esbuild.wasm',
      });
      setInitialized(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    startService();
    // eslint-disable-next-line
  }, []);

  const onClick = async () => {
    if (!initialized) return;

    iframeRef.current.srcdoc = html;

    const env = ['process', 'env', 'NODE_ENV'].join('.');

    try {
      const result = await esBuild.build({
        bundle: true,
        plugins: [unpkgPathPlugin(), fetchPlugin(value)],
        entryPoints: ['index.js'],
        write: false,
        define: {
          [env]: '"production"',
          global: 'window',
        },
      });

      iframeRef.current.contentWindow.postMessage(result?.outputFiles[0]?.text, '*');
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div>
      <textarea value={value} onChange={({ target }) => setValue(target.value)} />
      <div>
        <button onClick={onClick} type="button">
          submit
        </button>
      </div>

      <iframe ref={iframeRef} sandbox="allow-scripts" srcDoc={html} title="code" />
    </div>
  );
};
