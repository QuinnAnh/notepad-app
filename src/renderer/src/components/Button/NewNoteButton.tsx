import { ActionButton, ActionButtonProps } from '@/components'
import { createNoteAtom } from '@renderer/store'
import { useSetAtom } from 'jotai'
import { LuFileSignature } from 'react-icons/lu'

function NewNoteButton({ ...props }: ActionButtonProps) {
  const createEmptyNote = useSetAtom(createNoteAtom)

  const handleCreation = () => {
    createEmptyNote()
  }
  return (
    <ActionButton onClick={handleCreation} {...props}>
      <LuFileSignature className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}

export default NewNoteButton
