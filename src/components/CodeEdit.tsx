import Editor, { OnChange, OnMount } from '@monaco-editor/react';
import { MonacoJsxSyntaxHighlight, getWorker } from 'monaco-jsx-syntax-highlight';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import { useRef, useCallback } from 'react';

import 'bulmaswatch/superhero/bulmaswatch.min.css';
import styles from './CodeEdit.module.scss';

interface CodeEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editRef = useRef<any>();

  const onEditChange: OnChange = (value) => {
    if (!value) return;
    onChange(value);
  };

  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      esModuleInterop: true,
    });

    const monacoJsxSyntaxHighlight = new MonacoJsxSyntaxHighlight(getWorker(), monaco);

    // editor is the result of monaco.editor.create
    const { highlighter, dispose } = monacoJsxSyntaxHighlight.highlighterBuilder({
      editor,
    });
    // init highlight
    highlighter();

    editor.onDidChangeModelContent(() => {
      // content change, highlight
      highlighter();
    });

    return dispose;
  }, []);

  const onMount: OnMount = (editor, monaco) => {
    editor.getModel()?.updateOptions({ tabSize: 2 });
    handleEditorDidMount(editor, monaco);
    editRef.current = editor;
  };

  const onFormatClick = () => {
    // 1. get current value
    const beforeFormat = editRef.current.getModel()?.getValue();

    // 2. format value
    const formatted = prettier
      .format(beforeFormat, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, '');

    // 3. set the format value back in the editor
    editRef.current.setValue(formatted);
  };

  return (
    <div className={styles['edit-container']}>
      <button
        className={`button is-primary is-small ${styles['button-format']}`}
        onClick={onFormatClick}
        type="button"
      >
        Format
      </button>
      <Editor
        className="editor"
        value={initialValue}
        onChange={onEditChange}
        onMount={onMount}
        path="file:///index.tsx"
        defaultLanguage="javascript"
        theme="vs-dark"
        language="javascript"
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: true,
          automaticLayout: true,
        }}
      />
    </div>
  );
};
