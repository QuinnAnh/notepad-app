import { selectedNoteAtom } from '@renderer/store'
import { useAtomValue } from 'jotai'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const FloatingNoteTitle = ({ className, ...props }: ComponentProps<'div'>) => {
  // The useAtomValue hook is a Jotai hook used to read the current value from an atom without needing the setter function. It subscribes the component to that atom so if the atom’s value changes, the component will re-render with the new value.
  // it assigns the current value stored in selectedNoteAtom to the variable selectedNote. This variable now holds whatever the current state is.
  const selectedNote = useAtomValue(selectedNoteAtom)

  if (!selectedNote) return null
  return (
    <div className={twMerge('flex justify-center', className)} {...props}>
      <span className="text-gray-400">{selectedNote.title}</span>
    </div>
  )
}
