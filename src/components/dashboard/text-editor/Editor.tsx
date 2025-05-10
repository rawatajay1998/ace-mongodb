import "./style.css";

import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";

// Icons
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Underline,
  List,
  ListOrdered,
  Codepen,
  Link,
  Image,
  AlignLeft,
  Undo,
  Redo,
  ChevronDown,
  HardDrive,
  Code2,
} from "lucide-react";

type TipTapEditorProps = {
  onEditorChange?: (content: string) => void;
};

const TipTapEditor: React.FC<TipTapEditorProps> = ({ onEditorChange }) => {
  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
    ],
    content: "<p>Enter Here</p>",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onEditorChange?.(html);
    },
  });

  if (!editor) return null;

  return (
    <>
      <div className="control-group toolbar_editor">
        <div className="button-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
          >
            <Underline />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().clearNodes().run()}
          >
            <HardDrive />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            <AlignLeft />
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            H1
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Codepen />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Code2 />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <ChevronDown />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHardBreak().run()}
          >
            <Image />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setColor("#958DF1").run()}
          >
            <Link />
          </button>
        </div>
      </div>

      <EditorContent editor={editor} />
    </>
  );
};

export default TipTapEditor;
