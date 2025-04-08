import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export type ActionButtonProps = ComponentProps<'button'>

export const ActionButton = ({ className, children, ...props }: ActionButtonProps) => {
  return (
    // twMerge is used to merge Tailwind CSS class names while handling potential conflicts or duplicates. When you pass multiple class strings to it, the function combines them into a single class string.
    // border-zinc-400/50: Specifies a border color from the Tailwind CSS Zinc color palette with 50% opacity.
    <button
      className={twMerge(
        'px-2 py-1 rounded-md border border-zinc-400/50 hover:bg-zinc-600/50 transition-colors duration-100',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
