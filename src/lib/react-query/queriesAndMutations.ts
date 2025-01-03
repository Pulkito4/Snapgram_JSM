import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from '@tanstack/react-query';
import { createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost } from '../appwrite/api';
import { INewPost, INewUser, IUpdatePost } from '@/types';
import { QUERY_KEYS } from './queryKeys';

export const useCreateUserAccountMutation = () => {
    return useMutation(
        {
            mutationFn: (user: INewUser) => createUserAccount(user),
        }
    );
};

export const useSignInAccountMutation = () => {
    return useMutation(
        {
            mutationFn: (user: { email: string, password: string }) => signInAccount(user),
        }
    );
};

export const useSignOutAccountMutation = () => {
    return useMutation(
        {
            mutationFn: signOutAccount,
        }
    );
};

export const useCreatePostMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: (post: INewPost) => createPost(post),
            // React Query will automatically refetch the data after the mutation is successful 

            // React Query allows us to fetch new fresh data and not let the data go stale
            // SO the next time we try to get the recent posts, this query will be invalidated and refetched
            // which means it will not be able to get the data from cache and will fetch the data from the server
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
                });
            },
        }
    );
}

export const useGetRecentPostsQuery = () => {
    return useQuery(
        {
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            queryFn: () => getRecentPosts(),
        }
    );
}

export const useLikePostQuery = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, likesArray }: { postId: string; likesArray: string[] }) => likePost(postId, likesArray),
        // This is where we would update the cache because we have updated the like count and the likes array 
        // so we need to update the cache otherwise if we visit the post details page again then it would still show the old like count
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
    })
}

export const useSavePostQuery = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, userId }: { postId: string; userId: string }) => savePost(postId, userId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
    })
}

export const useDeleteSavedPostQuery = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
    })
}

export const useGetCurrentUserQuery = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: () => getCurrentUser(),
    });
}

export const useGetPostByIdQuery = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId,
        // enabled : disable automatic refetching when the query mounts or changes query keys
        // i.e we want to enable the fetching when we are fetching data for another id 
        // but if we are fetching the same id then we don't want to refetch the data and used the cached one only
    });
}

export const useUpdatePostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
            });
        },
    })
}

export const useDeletePostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) => deletePost(postId, imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                // to show all the new posts (without the deleted one) after deleting the post
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
        },
    })
}

export const useGetPostsQuery = () => {

    // This is the query that will be used to get the posts for the infinite scroll
    // This is an inbuilt React Query hook that will be used to get the infinite posts
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts,

        // This is the function that tells React Query how to get the next page of data 
        getNextPageParam: (lastPage) => {
            if (lastPage && lastPage.documents.length === 0) {
                return null;
            }

            const lastId = lastPage?.documents[lastPage.documents.length - 1].$id
            return lastId;
        },
    });
}

export const useSearchPostsQuery = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm,  // refetch the data when search term is not empty and whenever it changes 
    });
}