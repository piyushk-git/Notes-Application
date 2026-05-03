import { useRef, forwardRef, useImperativeHandle } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'

const extensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    bulletList: { keepMarks: true },
    orderedList: { keepMarks: true },
  }),
  Underline,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: { rel: 'noopener noreferrer', class: 'rich-editor__link' },
  }),
  Image.configure({
    inline: false,
    allowBase64: true,
    HTMLAttributes: { class: 'rich-editor__img' },
  }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Placeholder.configure({ placeholder: 'Write your note…' }),
]

const RichTextEditor = forwardRef(function RichTextEditor(
  { initialHtml, onChange, minHeight = 220 },
  ref
) {
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: initialHtml || '<p></p>',
    editorProps: {
      attributes: {
        class: 'rich-editor__prose',
        spellCheck: 'true',
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChangeRef.current(ed.getHTML())
    },
  })

  useImperativeHandle(
    ref,
    () => ({
      appendText: (text) => {
        if (!editor || !text?.trim()) return
        const t = text.trim()
        editor.chain().focus().insertText(`${t} `).run()
      },
      focus: () => editor?.chain().focus().run(),
    }),
    [editor]
  )

  const fileInputRef = useRef(null)

  const addImageFromFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      const src = typeof reader.result === 'string' ? reader.result : ''
      if (src && editor) {
        editor.chain().focus().setImage({ src }).run()
      }
    }
    reader.readAsDataURL(file)
  }

  const setLink = () => {
    if (!editor) return
    const prev = editor.getAttributes('link').href
    const url = window.prompt('Link URL', prev || 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  if (!editor) {
    return <div className="rich-editor rich-editor--loading" style={{ minHeight }} />
  }

  return (
    <div className="rich-editor">
      <div className="rich-editor__toolbar" role="toolbar" aria-label="Formatting">
        <button
          type="button"
          className={`rich-editor__tool ${editor.isActive('bold') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          className={`rich-editor__tool ${editor.isActive('italic') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          className={`rich-editor__tool ${editor.isActive('underline') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
        >
          U
        </button>
        <span className="rich-editor__sep" />
        <button
          type="button"
          className={`rich-editor__tool ${editor.isActive('bulletList') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet list"
        >
          •
        </button>
        <button
          type="button"
          className={`rich-editor__tool ${editor.isActive('orderedList') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered list"
        >
          1.
        </button>
        <button
          type="button"
          className={`rich-editor__tool rich-editor__tool--wide ${editor.isActive('taskList') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          title="Checklist"
        >
          Checklist
        </button>
        <span className="rich-editor__sep" />
        <button type="button" className="rich-editor__tool" onClick={setLink} title="Link">
          🔗
        </button>
        <button
          type="button"
          className="rich-editor__tool"
          onClick={() => fileInputRef.current?.click()}
          title="Insert image"
        >
          🖼
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="rich-editor__file"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) addImageFromFile(f)
            e.target.value = ''
          }}
        />
      </div>
      <EditorContent editor={editor} style={{ minHeight }} />
    </div>
  )
})

export default RichTextEditor
