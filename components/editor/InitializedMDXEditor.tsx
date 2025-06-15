"use client";

import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  codeBlockPlugin,
  codeMirrorPlugin,
  ConditionalContents,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  imagePlugin,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  ListsToggle,
  Separator,
  tablePlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import { basicDark } from "cm6-theme-basic-dark";
import { useTheme } from "next-themes";
import type { ForwardedRef } from "react";

import "@mdxeditor/editor/style.css";
import "./dark-editor.css";

export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
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
}
