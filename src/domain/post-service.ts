import {postsRepository} from "../repositories/posts-repository";
import {InterfacePostInput, InterfacePostView} from "../dto/interface.post";


export const postsService = {

    postPost: async (body: InterfacePostInput) => {
        return postsRepository.postPost(body)
    },
    putPost: async (body: InterfacePostView, id: string) => {
        return postsRepository.putPost(body, id)
    },
    deletePost: async (id: string): Promise<boolean | null> => {
        return postsRepository.deletePost(id)
    }

}