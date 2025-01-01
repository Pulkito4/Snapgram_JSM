import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from '@tanstack/react-query';
import { createPost, createUserAccount, signInAccount, signOutAccount } from '../appwrite/api';
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