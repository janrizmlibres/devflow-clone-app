"use client";

import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  codeMirrorPlugin,
  codeBlockPlugin,
  InsertCodeBlock,
  Separator,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  linkPlugin,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
} from "@mdxeditor/editor";
import { basicDark } from "cm6-theme-basic-dark";
import { useTheme } from "next-themes";
import { type ForwardedRef } from "react";

import "@mdxeditor/editor/style.css";
import "./dark-editor.css";

interface Props extends MDXEditorProps {
  editorRef?: ForwardedRef<MDXEditorMethods> | null;
}

const Editor = ({ editorRef, ...props }: Props) => {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? [basicDark] : [];

  return (
    <MDXEditor
      key={resolvedTheme}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        imagePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            txt: "Text",
            html: "HTML",
            scss: "CSS | SCSS",
            jsx: "JavaScript | JSX",
            tsx: "TypeScript | TSX",
            sql: "SQL",
            json: "JSON",
          },
          autoLoadLanguageSupport: true,
          codeMirrorExtensions: theme,
        }),
        diffSourcePlugin({
          codeMirrorExtensions: theme,
        }),
        toolbarPlugin({
          toolbarContents: () => (
            <ConditionalContents
              options={[
                {
                  when: (editor) => editor?.editorType === "codeblock",
                  contents: () => <ChangeCodeMirrorLanguage />,
                },
                {
                  fallback: () => (
                    <DiffSourceToggleWrapper options={["source", "rich-text"]}>
                      <UndoRedo />
                      <Separator />

                      <BoldItalicUnderlineToggles />
                      <Separator />

                      <ListsToggle />
                      <Separator />

                      <CreateLink />
                      <InsertImage />
                      <Separator />

                      <InsertTable />
                      <InsertThematicBreak />

                      <InsertCodeBlock />
                    </DiffSourceToggleWrapper>
                  ),
                },
              ]}
            />
          ),
        }),
      ]}
      {...props}
      ref={editorRef}
      className="dark-editor markdown-editor grid w-full border light-border-2 background-light800_dark200"
    />
  );
};

export default Editor;
