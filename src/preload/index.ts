import { electronAPI } from '@electron-toolkit/preload'
import { GetNotes, ReadNote, WriteNote } from '@shared/types'
import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('context', {
      locale: navigator.language,
      getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args),
      readNote: (...args: Parameters<ReadNote>) => ipcRenderer.invoke('readNote', ...args),
      writeNote: (...args: Parameters<WriteNote>) => ipcRenderer.invoke('writeNote', ...args)
    })
  } catch (error) {
    console.error('Error exposing window.context:', error)
  }
} else {
  console.log('Context isolation is disabled. Exposing window.electron and window.api.')
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}
