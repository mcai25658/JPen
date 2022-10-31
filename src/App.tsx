import { useState, useEffect } from 'react';

import { bundler, startService } from './bundler';
import { CodeEditor } from './components/CodeEditorComponent';
import { Preview } from './components/Preview';

import './main.scss';

const defaultCode = `
import React from 'react'
import ReactDOM from 'react-dom/client';

const App = () => {
  return <h1>hi</h1>
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
`;

export const App = () => {
  const [input, setInput] = useState(defaultCode);
  const [code, setCode] = useState('');
  const [initial, setInitial] = useState(false);

  const onClick = async () => {
    if (!initial) return;
    const output = await bundler(input);
    setCode(output);
  };

  useEffect(() => {
    const start = async () => {
      const result = await startService();
      if (!result) return;
      setInitial(true);
    };

    start();
  }, []);

  return (
    <div>
      <CodeEditor
        initialValue={defaultCode}
        onChange={(value) => {
          setInput(value);
        }}
      />

      <div>
        <button onClick={onClick} type="button">
          submit
        </button>
      </div>

      <Preview code={code} />
    </div>
  );
};
