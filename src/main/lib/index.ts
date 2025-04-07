import { appDirectoryName, fileEncoding } from '@shared/constants'
import { NoteInfo } from '@shared/models'
import { CreateNote, DeleteNote, GetNotes, ReadNote } from '@shared/types'
import { dialog } from 'electron'
import { ensureDir, readdir, readFile, remove, stat, writeFile } from 'fs-extra'
import { isEmpty } from 'lodash'
import path from 'path'
import welcomeNoteFile from '../../../resources/welcomeNote.md?asset'

export const getRootDir = () => {
  const rootDir = process.cwd()
  return `${rootDir}\\${appDirectoryName}`
}

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

export const getNoteInfoFromFilename = async (filename: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}/${filename}`)

  return {
    title: filename.replace('.md', ''),
    lastEditTime: fileStats.mtimeMs
  }
}

export const readNote: ReadNote = async (filename: string) => {
  const rootDir = getRootDir()

  return readFile(`${rootDir}\\${filename}.md`, { encoding: fileEncoding })
}

export const writeNote = async (filename: string, content: string) => {
  const rootDir = getRootDir()
  return writeFile(`${rootDir}\\${filename}.md`, content, { encoding: fileEncoding })
}

export const createNote: CreateNote = async () => {
  const rootDir = getRootDir()
  await ensureDir(rootDir)
  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'New note',
    defaultPath: `${rootDir}\\Untitled.md`,
    buttonLabel: 'Create',
    properties: ['createDirectory', 'showOverwriteConfirmation'],
    showsTagField: false,
    filters: [
      {
        name: 'Markdown',
        extensions: ['md']
      }
    ]
  })

  if (canceled || !filePath) {
    console.log('Note creation canceled')
    return false
  }

  const { name: filename, dir: parentDir } = path.parse(filePath)

  if (parentDir !== rootDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Error',
      message: `All the notes should be saved in the ${rootDir} directory. Avoid saving them in other directories.`
    })

    return false
  }

  console.info('Creating note: ', filename, filePath)
  await writeFile(filePath, '', { encoding: fileEncoding })

  return filename
}

export const deleteNote: DeleteNote = async (filename: string) => {
  const rootDir = getRootDir()

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete note',
    message: `Are you sure you want to delete the note "${filename}"?`,
    buttons: ['Cancel', 'Delete'],
    defaultId: 0,
    cancelId: 0
  })

  if (response === 0) {
    return false
  }

  console.info('Deleting note: ', filename)
  await remove(`${rootDir}\\${filename}.md`)
  return true
}
