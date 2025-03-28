import { notesMock } from '@renderer/store/mocks'
import { ComponentProps } from 'react'
import { NotePreview } from './NotePreview'

export const NotePreviewList = ({ ...props }: ComponentProps<'ul'>) => {
  return (
    <ul {...props}>
      {notesMock.map((note) => (
        <NotePreview
          key={note.title + note.lastEditTime} // Ensure unique key by combining title and lastEditTime
          {...note}
        />
      ))}
    </ul>
  )
}
