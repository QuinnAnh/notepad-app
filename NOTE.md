## Table of content

1. [Electron](#electron)
2. [Jotai](#jotai)
3. [twMerge](#twmerge)
4. [MDXEditor](#mdxeditor)
5. [Set up state](#set-up-state)

## Electron

Electron is a framework for building desktop applications using JavaScript, HTML, and CSS. By embedding Chromium and Node.js into its binary, Electron allows you to maintain one JavaScript codebase and create cross-platform apps that work on Windows, macOS, and Linux — no native development experience required.

- Main Process (`src/main/`):
  Contains the core application logic, window management, and system interactions. The `index.ts` is the entry point, with additional utilities organized in the lib folder.

- Preload Script (`src/preload/`):
  Serves as a secure bridge between the main and renderer processes. Use Electron’s contextBridge.exposeInMainWorld to expose a limited and secure API (for example, file operations or data fetching) to the renderer. It exposes a controlled API (documented via `index.d.ts`) to the renderer, ensuring safety and type-checking.

- Renderer Process (`src/renderer/`):
  Implements the application's user interface. It interacts with the exposed API from the preload script and handles all client-side logic.

- `tsconfig.web.json`:
  Configures TypeScript for web (renderer) code—handles React and JSX, sets up path aliases for the renderer, and includes files specific to the UI.

  - Inheritance:
    It extends a base configuration from @electron-toolkit/tsconfig/tsconfig.web.json, which contains common settings for the renderer environment.

  - Key Settings:

    `include`:
    Specifies the files to include when compiling the renderer code. It includes type declarations (env.d.ts), all source files inside the renderer folder (including TSX files), and shared code.

    `jsx`:
    Set to "react-jsx" so that JSX syntax can be processed with the new JSX transform introduced in React 17+.

    `paths`:
    Defines path aliases, making imports clearer and maintaining organization. For example, @renderer/_ maps to the renderer source folder; @shared/_ maps to shared code.

- `tsconfig.node.json`:
  Configures TypeScript for Node.js (main process and preload) code—includes Electron and Node types, sets up different path aliases, and ensures that the main logic is compiled correctly.

  - Inheritance:
    Extends a base config from @electron-toolkit/tsconfig/tsconfig.node.json, ensuring that Node.js-specific settings and module resolution work as expected.

  - Key Settings:

    - `include`:
      Lists files specific to the main process, preload scripts, and any shared code necessary for backend operations. Notice files like electron.vite.config.\* and code within src/main/ are included.

    - `types`:
      The "electron-vite/node" type definitions are included, ensuring that Node.js and Electron-specific globals or APIs are properly typed.

    - `paths`:
      Provides aliasing for the main process code (e.g., @/_ for src/main/_), making module imports more manageable.

- `electron.vite.config.ts`:
  Directs the build process with electron-vite, providing distinct configurations for bundling the main process, preload scripts, and renderer code. It integrates Vite plugins and sets up module aliases to align with your TypeScript configuration.
  Environment Specific Configurations: It separates the configuration for each part of the Electron app: main, preload, and renderer.

  - Key Config Sections:

    - `main`:

      - Plugins:
        Uses plugins such as `externalizeDepsPlugin()` that help in managing dependencies so that native Node.js modules are not bundled unnecessarily.

      - Resolve.alias:
        Defines alias mappings for the main process (e.g.,`@/lib` and `@shared`), aligning with the paths set in `tsconfig.node.json`.

    - `preload`:

      - Plugins:
        Also applies `externalizeDepsPlugin()` to the preload scripts, ensuring that dependencies are properly handled during the bundle.

    - `renderer`:

      - Assets & Resolve:
        Configures asset inclusion (like images or styles) and sets up alias mappings (for example, `@renderer`, `@/hooks`, `@/store`, etc.) to simplify module imports.

      - Plugins:
        Integrates the React plugin (`@vitejs/plugin-react`), enabling fast refresh and proper JSX transformation.

## Jotai

Jotai is a minimalistic state management library for React. It revolves around the concept of atoms—small, isolated pieces of state—which can be shared and updated throughout your application.
`atom`: in Jotai is a unit of state. You define an atom using Jotai’s atom function, and it encapsulates a piece of state which can be read and modified by various components. The primary function from Jotai to create state atoms, which can store both synchronous and asynchronous state.
`unwrap`: A utility from Jotai used to convert an asynchronous atom (one that may hold a Promise) into one that “unwraps” the promise. This allows consuming components to read the atom without dealing with the promise directly.

## twMerge

twMerge is used to merge Tailwind CSS class names while handling potential conflicts or duplicates. When you pass multiple class strings to it, the function combines them into a single class string. If there are conflicting classes (for example, two classes that set the same property with different values), twMerge will determine which one should take priority based on its internal rules.

```javascript
className={twMerge(
  'px-2 py-1 rounded-md border border-zinc-400/50 hover:bg-zinc-600/50 transition-colors duration-100',
  className
)}
```

## MDXEditor

The **MDXEditor** is a specialized editor component (often used in MDX or Markdown editing scenarios) that allows you to write and format content. It likely supports rich-text editing and Markdown/MDX features.

```javascript
<MDXEditor
  ref={editorRef}
  key={selectedNote.title}
  markdown={selectedNote.content}
  onChange={handleAutoSave}
  onBlur={handleBlur}
  plugins={[headingsPlugin(), listsPlugin(), quotePlugin(), markdownShortcutPlugin()]}
  contentEditableClassName="outline-none min-h-screen max-w-none text-lg px-8 py-5 caret-yellow-500 prose prose-invert prose-p:my-3 prose-p:leading-relaxed prose-headings:my-4 prose-blockquote:my-4 prose-ul:my-2 prose-li:my-0 prose-code:px-1 prose-code:text-red-500 prose-code:before:content-[''] prose-code:after:content-['']"
/>
```

##### Props Explanation

`ref={editorRef}`

Usage: The ref prop attaches a React ref (in this case, editorRef) to the MDXEditor component.

Purpose: This allows the parent component to directly interact with the editor instance (for example, to set focus, read methods, or trigger programmatic updates).

`key={selectedNote.title}`

Usage: The key prop is a standard React attribute used to help identify which items have changed, are added, or are removed.

Purpose: By using selectedNote.title as the key, the component forces a re-render or re-mount whenever the title changes. This can help ensure that the editor resets its internal state when a new note is selected.

`markdown={selectedNote.content}`

Usage: The markdown prop provides the initial content for the editor.

Purpose: Here, the content of the selected note (expected to be in Markdown format) is passed into the editor so that it can be displayed and edited.

`onChange={handleAutoSave}`

Usage: The onChange prop assigns an event handler that is triggered whenever the content of the editor changes.

Purpose: This function (handleAutoSave) is intended to automatically save the note as the user types or modifies the content, ensuring that changes are not lost.

`onBlur={handleBlur}`

Usage: The onBlur event handler is called when the editor loses focus.

Purpose: This is typically used to trigger additional behavior (such as finalizing edits, validation, or saving content once the user navigates away from the editor).

`plugins={[headingsPlugin(), listsPlugin(), quotePlugin(), markdownShortcutPlugin()]}`

Usage: The plugins prop receives an array of plugin functions.

Purpose: Each plugin extends the functionality of the editor:

`headingsPlugin()` might add support for managing headings or structured content.

`listsPlugin()` likely adds list formatting (bulleted/numbered lists).

`quotePlugin()` could provide features to format and insert block quotes.

`markdownShortcutPlugin()` possibly enables keyboard shortcuts for common markdown actions.

These plugins enhance the editor's capabilities, making it more versatile for creating and editing Markdown/MDX content.

`contentEditableClassName="..."`

Usage: This prop assigns a long string of Tailwind CSS utility classes to style the content-editable area of the editor.

Purpose: The classes define various style properties

`prose and related classes (prose-invert, prose-p:my-3, etc.)`:
These classes, often part of a typography plugin, format the content (paragraphs, headings, blockquotes, lists, etc.) to look consistent and visually appealing.

`prose-code:px-1 prose-code:text-red-500 prose-code:before:content-[''] prose-code:after:content-['']`:
Specifically styles inline code elements with padding, a red color, and additional pseudo-element configuration for aesthetics.

## Set up state

1. Define type in `src/shared/types`

```javascript
export type GetNotes = () => Promise<NoteInfo[]>
```

2. Implement the function to retrieve notes in `src/main/lib/index`

```javascript
export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir()
  await ensureDir(rootDir)

  const notesFileNames = await readdir(rootDir, {
    encoding: 'utf-8',
    withFileTypes: false
  })

  const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))

  if (isEmpty(notes)) {
    const content = await readFile(welcomeNoteFile, { encoding: fileEncoding })
    await writeFile(`${rootDir}\\Welcome.md`, content, { encoding: fileEncoding })

    notes.push(welcomeNoteFile)
  }

  return Promise.all(notes.map(getNoteInfoFromFilename))
}
```

3. Set up inter-process communication (IPC) handlers using Electron’s `ipcMain.handle` for the function when the app is ready in `src/main/index.js`. `ipcMain.handle` registers an asynchronous handler for a specified IPC channel.

```javascript
  ipcMain.handle('getNotes', (_, ...args: Parameters<GetNotes>) => getNotes(...args))
```

4. Expose a secure API from the Electron main process to the renderer process using Electron’s `contextBridge` in `src/preload/index.ts`. It makes a set of functionalities available on the global window object without exposing the full Node.js or Electron internals. The `contextBridge.exposeInMainWorld` API is used in Electron’s preload script to safely expose selected methods and properties to the renderer process. This way, you can provide a well-defined, limited API while isolating the renderer from direct access to Node.js and Electron internals, thereby enhancing security.

```javascript
contextBridge.exposeInMainWorld('context', {
      locale: navigator.language,
      getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args)
})
```

5. Declaration that augments the global Window interface, ensuring that the custom property expose on the global window object has well-defined types. It's typically placed in a declaration file `src/preload/index.d.ts` to inform TypeScript about properties added by preload script.

```javascript
declare global {
  interface Window {
    // electron: ElectronAPI
    context: {
      locale: string
      getNotes: GetNotes
    }
  }
}
```

6. Create and configure the notes state in `src/renderer/store/index.ts`.

```javascript
const loadNotes = async () => {
  const notes = await window.context.getNotes()
  return notes.sort((a, b) => b.lastEditTime - a.lastEditTime)
}

const notesAtomAsync = atom<NoteInfo[] | Promise<NoteInfo[]>>(loadNotes())

export const notesAtom = unwrap(notesAtomAsync, (prev) => prev)
```

7. consuming the state in a component. For example in `src\renderer\src\hooks\useNotesList.tsx`:

```javascript
const notes = useAtomValue(notesAtom)
```
