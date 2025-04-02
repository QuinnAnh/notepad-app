import { atom } from 'jotai'

export const notesAtom = atom(async () => {
  const notes = await window.context.getNotes()
  return notes.sort((a, b) => b.lastEditTime - a.lastEditTime)
})

export const selectedNoteIndexAtom = atom<number | null>(null)

export const selectedNoteAtom = atom((get) => {
  const notes = get(notesAtom)
  const selectedIndex = get(selectedNoteIndexAtom)
  if (selectedIndex == null || !notes) return null

  const selectedNote = notes[selectedIndex]

  return {
    ...selectedNote,
    content: `Hello ${selectedNote.title}`
  }
})

// export const createNoteAtom = atom(null, (get, set) => {
//   const notes = get(notesAtom)

//   if (!notes) return

//   const title = `Note ${notes.length + 1}`
//   const newNote = {
//     title,
//     lastEditTime: Date.now()
//   }
//   set(notesAtom, [newNote, ...notes.filter((note) => note.title !== newNote.title)])

//   set(selectedNoteIndexAtom, 0)
// })

// export const createNoteAtom = atom(
//   null,
//   async (get, set) => {
//     const notes = await get(notesAtom);
//     if (!notes) return;

//     const title = `Note ${notes.length + 1}`;
//     const newNote = {
//       title,
//       lastEditTime: Date.now()
//     };

//     set(
//       notesAtom,
//       [newNote, ...notes.filter((note) => note.title !== newNote.title)]
//     );

//     set(selectedNoteIndexAtom, 0);
//   }
// );

// export const deleteNoteAtom = atom(null, (get, set) => {
//   const notes = get(notesAtom)
//   const selectedNote = get(selectedNoteAtom)

//   if (!selectedNote || !notes) return

//   set(
//     notesAtom,
//     notes.filter((note) => note.title !== selectedNote.title)
//   )

//   set(selectedNoteIndexAtom, null)
// })
