import { useRef, useEffect } from 'react';

import './Preview.scss';

interface PreviewProps {
  code: string;
}
const DEFAULT_HTML = `
<html>
  <head></head>
  <body>
    <div id='root'>
    </div>
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

export const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframeRef = useRef<any>();

  useEffect(() => {
    // iframeRef.current.srcdoc = DEFAULT_HTML;
    iframeRef.current.contentWindow.postMessage(code, '*');
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe ref={iframeRef} sandbox="allow-scripts" srcDoc={DEFAULT_HTML} title="code" />
    </div>
  );
};
