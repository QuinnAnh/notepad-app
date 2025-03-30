import { cn, formatDate } from '@renderer/utils'
import { NoteInfo } from '@shared/models'
import { ComponentProps } from 'react'

export type NotePreviewProps = NoteInfo & {
  isActive?: boolean
} & ComponentProps<'div'>

export const NotePreview = ({
  title,
  content,
  lastEditTime,
  isActive = false,
  className,
  ...props
}: NotePreviewProps) => {
  const date = formatDate(lastEditTime)
  return (
    <div
      className={cn(
        'cursor-pointer px-2.5 py-3 mt-1.5 rounded-md transition-colors duration-85',
        {
          'bg-zinc-900/50 hover:bg-zinc-500/70': !isActive,
          'bg-zinc-400/70': isActive,
          'text-zinc-400 ': !isActive,
          'text-white': isActive
        },
        className
      )}
      {...props}
    >
      <h3 className="mb-1 font-bold truncate">{title}</h3>
      <span className="inline-block w-full mb-2 text-xs font-light text-left">{date}</span>
    </div>
  )
}
