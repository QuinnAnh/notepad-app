import { NoteInfo } from '@shared/models'
import { atom } from 'jotai'
import { unwrap } from 'jotai/utils'
import { notesMock } from './mocks'

// const loadNotes = async () => {
//   const notes = await window.context.getNotes()

//   // sort them by most recently edited
//   return notes.sort((a, b) => b.lastEditTime - a.lastEditTime)
// }

// const notesAtomAsync = atom<NoteInfo[] | Promise<NoteInfo[]>>(loadNotes())

// export const notesAtom = unwrap(notesAtomAsync, (prev) => prev)

export const notesAtom = atom<NoteInfo[] | null>(notesMock)

export const selectedNoteIndexAtom = atom<number | null>(null)

const selectedNoteAtomAsync = atom(async (get) => {
  const notes = get(notesAtom)
  const selectedIndex = get(selectedNoteIndexAtom)
  if (selectedIndex == null || !notes) return null

  const selectedNote = notes[selectedIndex]

  const noteContent = await window.context.readNote(selectedNote.title)

  return {
    ...selectedNote,
    content: noteContent
  }
})

export const selectedNoteAtom = unwrap(
  selectedNoteAtomAsync,
  (prev) =>
    prev ?? {
      title: '',
      lastEditTime: Date.now(),
      content: ''
    }
)

export const createNoteAtom = atom(null, (get, set) => {
  const notes = get(notesAtom)

  if (!notes) return

  const title = `Note ${notes.length + 1}`
  const newNote = {
    title,
    lastEditTime: Date.now()
  }
  set(notesAtom, [newNote, ...notes.filter((note) => note.title !== newNote.title)])

  set(selectedNoteIndexAtom, 0)
})

export const deleteNoteAtom = atom(null, (get, set) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) return

  set(
    notesAtom,
    notes.filter((note) => note.title !== selectedNote.title)
  )

  set(selectedNoteIndexAtom, null)
})

export const saveNoteAtom = atom(null, async (get, set, newContent: string) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) return

  const newNote = {
    ...selectedNote,
    content: newContent,
    lastEditTime: Date.now()
  }

  await window.context.writeNote(newNote.title, newContent)

  set(
    notesAtom,
    notes.map((note) => (note.title === newNote.title ? newNote : note))
  )
})
