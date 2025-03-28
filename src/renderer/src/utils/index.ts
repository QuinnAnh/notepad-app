import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const dateFormat = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'UTC'
})

export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return dateFormat.format(timestamp)
}

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(...args))
}
