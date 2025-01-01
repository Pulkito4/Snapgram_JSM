import { ID, ImageGravity, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { INewPost, INewUser } from "@/types";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name);

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            email: newAccount.email,
            name: newAccount.name,
            username: user.username,
            imageUrl: avatarUrl,
        });

        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string,
    email: string,
    name: string,
    imageUrl: string,
    username?: string,
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user);

        return newUser;


    } catch (error) {
        console.log(error);
    }
};

export async function signInAccount(user: { email: string, password: string }) {

    try {
        const session = await account.createEmailPasswordSession(
            user.email,
            user.password);

        return session;

    } catch (error) {
        console.log(error);

    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            // passing a query to filter the user by accountId
            [
                Query.equal('accountId', currentAccount.$id)
            ]);

        if (!currentUser) throw Error;

        return currentUser.documents[0];

    } catch (error) {
        console.log(error);
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function createPost(post: INewPost) {
    try {

        //Upload image to appwrite storage
        const uploadedFile = await uploadFile(post.file[0]);

        if (!uploadedFile) throw Error;
        const fileUrl = getFilePreviewUrl(uploadedFile.$id);

        if (!fileUrl) {
            // delete the file beacuse it was not uploaded successfully // if something becomes corrupted , delete the previous file
            deleteFile(uploadedFile.$id);
            throw Error;
        };

        // Convert Tags into an array 
        const tags = post.tags?.replace(/\s /g, '').split(',') || [];

        // save the new post to database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags,
            });

        if (!newPost) {
            // if the post was not saved successfully, delete the file
            deleteFile(uploadedFile.$id);
            throw Error;
        };

        return newPost;

    } catch (error) {
        console.log(error);
    }

}

// Uploads a file to appwrite storage
export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(appwriteConfig.storageId, ID.unique(), file);
        return uploadedFile;
    } catch (error) {
        console.log(error);
    }
}

export function getFilePreviewUrl(fileId: string) {
    try {

        const fileUrl = storage.getFilePreview(appwriteConfig.storageId,
            fileId,
            2000,  // width
            2000,  // height
            ImageGravity.Top,  // gravity  
            100);  // quality  // 100 means max quality
        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);
        return { status: "ok" };
    } catch (error) {
        console.log(error);
    }
}