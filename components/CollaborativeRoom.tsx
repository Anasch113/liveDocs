"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Editor } from '@/components/editor/Editor'
import Headers from '@/components/Headers'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense"
import ActiveCollaborators from './ActiveCollaborators ';
import { Input } from './ui/input'
import Image from 'next/image'
import { updateDocument } from '@/lib/actions/user.actions'
const CollaborativeRoom = ({ roomId, roomMetadata }: CollaborativeRoomProps) => {
    const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const currentUserType = 'editor'

    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLDivElement>(null)

    const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
       
        if (e.key === 'Enter') {
            setLoading(true)
            try {

                if (documentTitle !== roomMetadata.title) {
                    const updatedDocument = await updateDocument(roomId, documentTitle);

                    if (updatedDocument) {
                        setEditing(false);
                    }
                }
                
            } catch (error) {
                console.log("error", error)
            }
            setLoading(false)
        }
    }

    console.log("editing", editing)
    console.log("title", documentTitle)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setEditing(false)
                updateDocument(roomId, documentTitle);
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [roomId, documentTitle])


    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing])

    return (

        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<div>Loading…</div>}>
                <div className="collaborative-room">
                    <Headers>
                        <div ref={containerRef} className='w-fit flex items-center justify-center gap-2 '>
                            {editing && !loading ? (
                                <Input
                                    type="text"
                                    value={documentTitle}
                                    ref={inputRef}
                                    placeholder="Enter title"
                                    onChange={(e) => setDocumentTitle(e.target.value)}
                                    onKeyDown={updateTitleHandler}
                                    disable={!editing}
                                    className="document-title-input"
                                />
                            ) : (
                                <>
                                    <p className="document-title">{documentTitle}</p>
                                </>
                            )}

                            {currentUserType === 'editor' && !editing && (
                                <Image
                                    src="/assets/icons/edit.svg"
                                    alt="edit"
                                    width={24}
                                    height={24}
                                    onClick={() => setEditing(true)}
                                    className="pointer"
                                />
                            )}

                            {currentUserType !== 'editor' && !editing && (
                                <p className="view-only-tag">View only</p>
                            )}

                            {loading && <p className="text-sm text-gray-400">saving...</p>}
                        </div>
                        <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
                            <ActiveCollaborators />
                            <SignedOut>
                                <SignInButton />
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </Headers>
                    <Editor />
                </div>
            </ClientSideSuspense>
        </RoomProvider>

    )
}

export default CollaborativeRoom
