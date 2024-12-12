'use server'
import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";


export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
    try {
        const { data } = await (await clerkClient()).users.getUserList({
            emailAddress: userIds,
        });

        const users = data.map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            avatar: user.imageUrl,
        }));

        const sortedUsers = userIds.map((email) => users.find((user) => user.email === email));

        return parseStringify(sortedUsers);
    } catch (error) {
        console.log(`Error fetching users: ${error}`);
    }
}

export const getDocument = async ({ roomId, userId }: { roomId: string; userId: string }) => {


    try {
        const room = await liveblocks.getRoom(roomId)

        // Todo: Bring it back
        // const hasAccess = Object.keys(room.usersAccesses).includes(userId)

        // if (!hasAccess) {
        //     throw new Error("User do not have access to this document")
        // }
        return parseStringify(room)
    } catch (error) {
        console.log("Error while getting the room", error)
    }
}



export const updateDocument = async (roomId: string, title: string) => {
    try {
        const updatedRoom = await liveblocks.updateRoom(roomId, {
            metadata: {
                title
            }
        })

        revalidatePath(`/documents/${roomId}`);

        return parseStringify(updatedRoom);
    } catch (error) {
        console.log(`Error happened while updating a room: ${error}`);
    }
}
