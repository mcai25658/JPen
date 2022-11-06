import { useState, useEffect } from 'react';

import { bundler } from '../bundler';

import { CodeEditor } from './CodeEdit';
import { Preview } from './Preview';
import { ReSizeable } from './ReSizeable';

const defaultCode = `
import React from 'react'
import ReactDOM from 'react-dom/client';

const App = () => {
  return <h1>hi</h1>
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
`;

export const CodeCell = ({ initial }: { initial: boolean }) => {
  const [input, setInput] = useState(defaultCode);
  const [code, setCode] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!initial) return;
      const output = await bundler(input);
      setCode(output);
    }, 700);

    return () => {
      clearTimeout(timer);
    };
  }, [input, initial]);

  return (
    <ReSizeable direction="vertical">
      <div style={{ display: 'flex', height: '100%' }}>
        <ReSizeable direction="horizontal">
          <CodeEditor initialValue={defaultCode} onChange={(value) => setInput(value)} />
        </ReSizeable>
        <Preview code={code} />
      </div>
    </ReSizeable>
  );
};
