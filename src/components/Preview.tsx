import { useRef, useEffect } from 'react';

import './Preview.scss';

interface PreviewProps {
  code: string;
  bundleErr: string;
}
const DEFAULT_HTML = `
<html>
  <head></head>
  <body>
    <div id='root'>
    </div>
    <script>
      const errorHandler = (error) => {
        const root = document.querySelector('#root');
        root.innerHTML = 
        '<div style="color: red";><h4>Runtime Error</h4>' 
        + error + 
        '</div>'

        console.error(error)
      }

      window.addEventListener('error', (event) => {
        event.preventDefault();
        errorHandler(event.error)
      })

      window.addEventListener('message', (event) => {
        try {
          eval(event.data)
        } catch (error) {
          errorHandler(error)
        }
      }, false)
    </script>
  </body>
</html>
`;

export const Preview: React.FC<PreviewProps> = ({ code, bundleErr }) => {
  const iframeRef = useRef<any>();

  useEffect(() => {
    iframeRef.current.srcdoc = DEFAULT_HTML;

    setTimeout(() => {
      iframeRef.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code, bundleErr]);

  return (
    <div className="preview-wrapper">
      <iframe ref={iframeRef} sandbox="allow-scripts" srcDoc={DEFAULT_HTML} title="code" />

      {bundleErr && (
        <div style={{ position: 'absolute', top: 10, left: 10, color: 'red' }}>{bundleErr}</div>
      )}
    </div>
  );
};
