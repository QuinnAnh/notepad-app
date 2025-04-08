import { ActionButton, ActionButtonProps } from '@/components'
import { deleteNoteAtom } from '@renderer/store'
import { useSetAtom } from 'jotai'
import { FaRegTrashCan } from 'react-icons/fa6'

function DeleteNoteButton({ ...props }: ActionButtonProps) {
  //useSetAtom is a React hook provided by Jotai. Unlike useAtom, which returns both the current value and a setter function, useSetAtom returns only the setter function for the given atom. This is particularly useful when you only need to update the state without reading it.
  const deleteNote = useSetAtom(deleteNoteAtom)

  const handleDelete = async () => {
    await deleteNote()
  }

  return (
    <ActionButton onClick={handleDelete} {...props}>
      <FaRegTrashCan className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}

export default DeleteNoteButton
