import {InterfacePostInput, InterfacePostView} from "../dto/interface.post";
import {PostsRepositoryClass} from "../repositories/posts-repository";
import {inject, injectable} from "inversify";
@injectable()
export class PostsServiceClass {
    constructor(@inject(PostsRepositoryClass)protected postsRepository:PostsRepositoryClass) {
    }

    async postPost(body: InterfacePostInput) {
        return this.postsRepository.postPost(body)
    }

    async putPost(body: InterfacePostView, id: string) {
        return this.postsRepository.putPost(body, id)
    }

    async deletePost(id: string): Promise<boolean | null> {
        return this.postsRepository.deletePost(id)
    }
}

// export const postsService = new PostsServiceClass()
