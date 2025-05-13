"use client";
import "./style.css";

import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import React, { useState } from "react";

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
  Table2,
} from "lucide-react";

type TipTapEditorProps = {
  onEditorChange?: (content: string) => void;
};

const TipTapEditor: React.FC<TipTapEditorProps> = ({ onEditorChange }) => {
  const [showTableMenu, setShowTableMenu] = useState(false);
  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
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
          <div style={{ position: "relative" }}>
            <button
              type="button"
              className="pl-2 pr-2"
              style={{ width: "max-content" }}
              onClick={() => setShowTableMenu((prev) => !prev)}
            >
              <Table2 /> <ChevronDown size={14} />
            </button>

            {showTableMenu && (
              <div
                className="editor_table_buttons"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "180px",
                  background: "#0A0A0A",
                  border: "1px solid #2a2a2a",
                  padding: "8px",
                  borderRadius: "6px",
                  zIndex: 1000,
                }}
              >
                <button
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .insertTable({
                        rows: 3,
                        cols: 3,
                        withHeaderRow: true,
                      })
                      .run();
                    setShowTableMenu(false);
                  }}
                >
                  Insert Table
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().addColumnBefore().run();
                    setShowTableMenu(false);
                  }}
                >
                  Add Column Before
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().addColumnAfter().run();
                    setShowTableMenu(false);
                  }}
                >
                  Add Column After
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().deleteColumn().run();
                    setShowTableMenu(false);
                  }}
                >
                  Delete Column
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().addRowBefore().run();
                    setShowTableMenu(false);
                  }}
                >
                  Add Row Before
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().addRowAfter().run();
                    setShowTableMenu(false);
                  }}
                >
                  Add Row After
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().deleteRow().run();
                    setShowTableMenu(false);
                  }}
                >
                  Delete Row
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().deleteTable().run();
                    setShowTableMenu(false);
                  }}
                >
                  Delete Table
                </button>
              </div>
            )}
          </div>
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
