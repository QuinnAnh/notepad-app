import {
  Content,
  DraggableTopBar,
  MarkdownEditor,
  NotePreviewList,
  RootLayout,
  Sidebar
} from '@/components'
import React from 'react'
import { ActionButtonsRow } from './components/ActionButtonsRow'

const App = () => {
  const contentContainerRef = React.useRef<HTMLDivElement>(null)

  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0)
  }

  return (
    <>
      <DraggableTopBar />
      <RootLayout>
        <Sidebar className="border-l bg-zinc-900/50 p-2">
          <ActionButtonsRow className="flex justify-between mt-1" />
          <NotePreviewList className="mt-3 space-y-1" onSelect={resetScroll} />
        </Sidebar>
        <Content ref={contentContainerRef} className="border-l bg-zinc-900/50 border-l-white/20">
          <MarkdownEditor />
        </Content>
      </RootLayout>
    </>
  )
}

export default App
