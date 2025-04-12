import { NoteInfo } from '@shared/models'
import { atom } from 'jotai'
import { unwrap } from 'jotai/utils'

// an asynchronous function that calls window.context.getNotes() to fetch an array of notes
// after fetching, it sorts the notes in descending order based on their lastEditTime, so that the most recently edited note comes first
const loadNotes = async () => {
  const notes = await window.context.getNotes()

  // sort them by most recently edited
  return notes.sort((a, b) => b.lastEditTime - a.lastEditTime)
}

//an atom that holds either an array of NoteInfo objects or a promise that resolves to such an array. It is immediately initialized by calling loadNotes(), so it starts with a promise that will eventually resolve with the loaded and sorted notes
const notesAtomAsync = atom<NoteInfo[] | Promise<NoteInfo[]>>(loadNotes())

// this exports a version of the atom where the asynchronous value is “unwrapped.” The unwrap utility helps transform the atom so that when the notes are loaded, consuming components can work with the resolved value directly rather than handling a promise
export const notesAtom = unwrap(notesAtomAsync, (prev) => prev)

// export const notesAtom = atom<NoteInfo[] | null>(notesMock)

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

//this exports a version of the atom where the asynchronous value is “unwrapped”
// the unwrap utility helps transform the atom so that when the notes are loaded, consuming components can work with the resolved value directly rather than handling a promise
export const selectedNoteAtom = unwrap(
  selectedNoteAtomAsync,
  (prev) =>
    prev ?? {
      title: '',
      lastEditTime: Date.now(),
      content: ''
    }
)

export const createNoteAtom = atom(null, async (get, set) => {
  const notes = get(notesAtom)

  if (!notes) return

  const title = await window.context.createNote()

  if (!title) return

  const newNote = {
    title,
    lastEditTime: Date.now()
  }
  set(notesAtom, [newNote, ...notes.filter((note) => note.title !== newNote.title)])

  set(selectedNoteIndexAtom, 0)
})

export const deleteNoteAtom = atom(null, async (get, set) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) return

  const isDeleted = await window.context.deleteNote(selectedNote.title)

  if (!isDeleted) return

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
