import { ActionButton, ActionButtonProps } from '@/components'
import { FaRegTrashCan } from 'react-icons/fa6'

function DeleteNoteButton({ ...props }: ActionButtonProps) {
  return (
    <ActionButton {...props}>
      <FaRegTrashCan className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}

export default DeleteNoteButton
