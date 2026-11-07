import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

export default function CodeEditor({
  value,
  onChange,
  height = '190px',
  readOnly = false,
}) {
  return (
    <div className="code-surface">
      <CodeMirror
        value={value}
        height={height}
        theme={oneDark}
        extensions={[javascript()]}
        onChange={onChange}
        readOnly={readOnly}
        editable={!readOnly}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: !readOnly,
          highlightActiveLineGutter: !readOnly,
          autocompletion: false,
        }}
      />
    </div>
  )
}
