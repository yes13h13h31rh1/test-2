import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './CodeEditor.css';

interface CodeEditorProps {
  code: string;
  language?: string;
}

export default function CodeEditor({ code, language = 'typescript' }: CodeEditorProps) {
  // Map verse to a similar language for syntax highlighting
  const highlightLanguage = language === 'verse' ? 'rust' : language;
  
  return (
    <div className="code-editor">
      <SyntaxHighlighter
        language={highlightLanguage}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: '8px',
          fontSize: '0.9rem',
          padding: '1.5rem',
        }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
