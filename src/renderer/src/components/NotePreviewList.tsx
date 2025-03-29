import { notesMock } from '@renderer/store/mocks'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { NotePreview } from './NotePreview'

export const NotePreviewList = ({ className, ...props }: ComponentProps<'ul'>) => {
  if (notesMock.length === 0) {
    return (
      <ul className={twMerge('text-center pt-4', className)} {...props}>
        <span>No Notes Yet!</span>
      </ul>
    )
  }
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
