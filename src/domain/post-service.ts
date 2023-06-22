import {postsRepository} from "../repositories/posts-repository";
import {InterfacePostInput, InterfacePostView} from "../dto/interface.post";

class PostsServiceClass {
    async postPost(body: InterfacePostInput) {
        return postsRepository.postPost(body)
    }

    async putPost(body: InterfacePostView, id: string) {
        return postsRepository.putPost(body, id)
    }

    async deletePost(id: string): Promise<boolean | null> {
        return postsRepository.deletePost(id)
    }
}
export const postsService = new PostsServiceClass()
