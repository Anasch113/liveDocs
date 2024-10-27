import { Editor } from '@/components/editor/Editor'
import Headers from '@/components/Headers'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import React from 'react'

const Document = () => {

  return (
    <div>
      <Headers>
        <div className='w-fit flex items-center justify-center gap-2'>
        <p className='document-title'>fake title</p>
        </div>
        <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        
      </Headers>
      <Editor/>
    </div>
  )
}

export default Document
