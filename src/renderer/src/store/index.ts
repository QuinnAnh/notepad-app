import { NoteInfo } from '@shared/models'
import { atom } from 'jotai'
import { notesMock } from './mocks'

export const notesAtom = atom<NoteInfo[]>(notesMock)

export const selectedNoteIndexAtom = atom<number | null>(null)

export const selectedNoteAtom = atom((get) => {
  const notes = get(notesAtom)
  const selectedIndex = get(selectedNoteIndexAtom)
  if (selectedIndex == null) return null

  const selectedNote = notes[selectedIndex]

  return {
    ...selectedNote,
    content: `Hello ${selectedNote.title}`
  }
})

export const createNoteAtom = atom(null, (get, set) => {
  const notes = get(notesAtom)

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

  if (!selectedNote) return

  set(
    notesAtom,
    notes.filter((note) => note.title !== selectedNote.title)
  )

  set(selectedNoteIndexAtom, null)
})
