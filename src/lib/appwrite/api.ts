import { ID, ImageGravity, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";

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
            1080,  // width
            1080,  // height
            ImageGravity.Center,  // gravity  
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

// PREVIOUS/ ORIGINAL FUCNTION TO GET RECENT MOST POSTS ON HOME PAGE
// export async function getRecentPosts() {
//     try {
//         const posts = await databases.listDocuments(
//             appwriteConfig.databaseId,
//             appwriteConfig.postCollectionId,
//             [Query.orderDesc("$createdAt"), Query.limit(20)]
//         );

//         if (!posts) throw Error;

//         return posts;

//     } catch (error) {
//         console.log(error);
//         throw Error;

//     }
// }

// UPDATED FUNCTION TO GET RECENT POSTS WITH PAGINATION/ INFINITE SCROLL

export async function getRecentPosts({ pageParam }: { pageParam?: string }) {
    try {
        const queries: any[] = [
            Query.orderDesc("$createdAt"),
            Query.limit(15)
        ];
        if (pageParam) {
            queries.push(Query.cursorAfter(pageParam.toString()));
        }

        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        );

        if (!posts) throw Error;

        return posts;

    } catch (error) {
        console.log(error);
    }
}

export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            { likes: likesArray }
        )

        if (!updatedPost) throw Error;

        return updatedPost;

    } catch (error) {
        console.log(error);
    }
}

export async function savePost(postId: string, userId: string) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                post: postId,
                user: userId
            }
        )

        if (!updatedPost) throw Error;

        return updatedPost;

    } catch (error) {
        console.log(error);
    }
}

export async function deleteSavedPost(savedRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId
        )

        if (!statusCode) throw Error;
        return { status: "ok" }

    } catch (error) {
        console.log(error);
    }
}

export async function getPostById(postId: string) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
        return post;

    } catch (error) {
        console.log(error);
    }
}

export async function updatePost(post: IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0;

    try {
        let image = {
            imageUrl: post.imageUrl.toString(),
            imageId: post.imageId,
        }

        if (hasFileToUpdate) {
            //Upload image to appwrite storage
            const uploadedFile = await uploadFile(post.file[0]);

            if (!uploadedFile) throw Error;
            const fileUrl = getFilePreviewUrl(uploadedFile.$id);

            if (!fileUrl) {
                // delete the file beacuse it was not uploaded successfully // if something becomes corrupted , delete the previous file
                deleteFile(uploadedFile.$id);
                throw Error;
            };

            // Delete the old image from storage
            await deleteFile(post.imageId);

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
        }


        // Convert Tags into an array 
        const tags = post.tags?.replace(/\s /g, '').split(',') || [];

        // save the new post to database
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {
                caption: post.caption,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location,
                tags: tags,
            });

        if (!updatedPost) {
            // if the post was not saved successfully, delete the file
            if (hasFileToUpdate) {
                await deleteFile(image.imageId);
            }
            throw Error;
        };

        return updatedPost;

    } catch (error) {
        console.log(error);
    }
}

export async function deletePost(postId: string, imageId: string) {
    if (!postId || !imageId) throw Error;

    try {
        // Delete saves records first
        const saves = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            [Query.equal('post', postId)]
        );

        // Delete all saves
        const deletePromises = saves.documents.map((save) =>
            databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.savesCollectionId,
                save.$id
            )
        );

        // Wait for all saves to be deleted
        await Promise.all(deletePromises);

        // Delete post image
        await storage.deleteFile(appwriteConfig.storageId, imageId);

        // Finally delete the post
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        );

        return { status: "ok" };
    } catch (error) {
        console.log(error);
    }
}

export async function getInfinitePosts({ pageParam }: { pageParam?: string }) {
    try {
        const queries: any[] = [Query.orderDesc("$createdAt"), Query.limit(9)
        ]
        if (pageParam) {
            queries.push(Query.cursorAfter(pageParam))
        }
        try {
            const posts = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.postCollectionId,
                queries
            )

            if (!posts) throw Error;

            return posts;

        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        console.log(error);
        return {documents: []};
    }
}

export async function searchPosts(searchTerm: string) {
    try {

        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchTerm)]
        )

        if (!posts) throw Error;

        return posts;

    } catch (error) {
        console.log(error);
    }
}

export async function getUsers() {
    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
        )

        if (!users) throw Error;
        return users;

    } catch (error) {
        console.log(error);
    }
}

export async function getTopCreators() {
    try {
        // Step 1: Fetch all users
        const usersResponse = await getUsers();
        const users = usersResponse?.documents;

        if (!users || users.length === 0) {
            return { documents: [] }; // No users found
        }

        // Step 2: Sort users by the length of their 'posts' array (descending order)
        const sortedUsers = users
            .map((user) => ({
                ...user,
                postCount: user.posts ? user.posts.length : 0, // Calculate post count
            }))
            .sort((a, b) => b.postCount - a.postCount);

        // Step 3: Get the top 5 users
        const topUsers = sortedUsers.slice(0, 5);

        return { documents: topUsers };



    } catch (error) {
        console.log(error);
        return { documents: [] }; // Return empty array on error
    }
}

export async function getUserById(userId: string) {
    try {
        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
        )

        return user;

    } catch (error) {
        console.log(error);
    }
}

export async function updateUserProfile(user: IUpdateUser) {
    const hasFileToUpdate = user.file.length > 0;

    try {
        let image = {
            imageUrl: user.imageUrl,
            imageId: user.imageId,
        };


        if (hasFileToUpdate) {
            const uploadedFile = await uploadFile(user.file[0]);

            if (!uploadedFile) throw Error;

            const fileUrl = getFilePreviewUrl(uploadedFile.$id);

            if (!fileUrl) {
                // delete the file beacuse it was not uploaded successfully // if something becomes corrupted , delete the previous file
                deleteFile(uploadedFile.$id);
                throw Error;
            };
            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
        }


        // update user
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
                name: user.name,
                bio: user.bio,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
            }
        )

        // Failed to update
        if (!updatedUser) {

            // if the user was not saved successfully, delete the file
            if (hasFileToUpdate) {
                await deleteFile(image.imageId);
            }
            throw Error;
        }

        // Safely delete old file after successful update
        if (user.imageId && hasFileToUpdate) {
            await deleteFile(user.imageId);
        }

        return updatedUser;


    } catch (error) {
        console.log(error);
    }
}