import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from '@tanstack/react-query';
import { createPost, createUserAccount, deleteSavedPost, getCurrentUser, getRecentPosts, likePost, savePost, signInAccount, signOutAccount } from '../appwrite/api';
import { INewPost, INewUser } from '@/types';
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