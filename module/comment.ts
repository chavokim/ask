import {QueryClient, useMutation, useQuery} from "react-query";

export interface Comment {
    _id: number;
    name: string;
    content: string;
    createdAt: string;
}

export interface CommentDTO {
    content: string;
}

export const useComments = (name: string) => useQuery<Comment[]>({
    queryKey: ["comments", name],
    queryFn: () => fetch(`/api/${name}`).then(res => res.json()),
    refetchInterval: 1000,
});

export const useCommentMutation = (queryClient: QueryClient, name: string, parentId?: string) =>
    useMutation<unknown, typeof Error, CommentDTO>({
        mutationFn: (comment) => {
            return fetch(`/api/${name}`, {
                method: 'POST',
                body: JSON.stringify(comment),
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["comments", name],
            });
            alert("성공적으로 등록되었습니다.");
        },
        onError: (error) => {
            alert(
                error.toString(),
            )
        }
    })