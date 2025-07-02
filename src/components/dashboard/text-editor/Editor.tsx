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
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

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
  ImageIcon,
  AlignLeft,
  Undo,
  Redo,
  ChevronDown,
  HardDrive,
  Code2,
  Table2,
  LinkIcon,
} from "lucide-react";

type TipTapEditorProps = {
  initialContent?: string;
  onEditorChange?: (content: string) => void;
};

const TipTapEditor: React.FC<TipTapEditorProps> = ({
  initialContent,
  onEditorChange,
}) => {
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
      Link,
      Image.configure({
        inline: true,
        allowBase64: true, // Enable base64 images
      }),
    ],
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onEditorChange?.(html);
    },
    content: initialContent,
  });

  if (!editor) return null;

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      if (!input.files?.length) return;
      const file = input.files[0];

      // Convert image to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        editor.commands.setImage({ src: base64 });
      };
      reader.readAsDataURL(file);
    };

    input.click();
  };

  const addLink = () => {
    let url = window.prompt("Enter URL");
    if (!url) return;

    // Normalize URL only by adding protocol if missing
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    if (editor.state.selection.empty) {
      // No selection: insert the URL as a clickable link text
      editor
        .chain()
        .focus()
        .insertContent(
          `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
        )
        .run();
    } else {
      // There is selection: toggle link mark on selection
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: "_blank", rel: "noopener noreferrer" })
        .run();
    }
  };

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
            onClick={() => {
              const html = window.prompt("Enter HTML code");
              if (html) {
                editor.commands.insertContent(html);
              }
            }}
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
          <button type="button" onClick={addImage} title="Add Image">
            <ImageIcon />
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
          <button type="button" onClick={addLink} title="Add Link">
            <LinkIcon />
          </button>
        </div>
      </div>

      <EditorContent editor={editor} />
    </>
  );
};

export default TipTapEditor;
