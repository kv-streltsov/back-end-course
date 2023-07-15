import {InterfaceGetBlogsWitchQuery} from "../dto/interface.blog";
import {WithId} from "mongodb";
import {postsModel} from "../db/schemes/posts.scheme";
import {Blog, blogsModel} from "../db/schemes/blogs.scheme";
import {injectable} from "inversify";

@injectable()
export class QueryBlogsRepositoryClass {

    private DEFAULT_SORT_FIELD = 'createdAt'
    private PROJECTION = {_id: 0, __v: 0}

    async getAllBlogs(
        pageNumber: number = 1,
        pageSize: number = 10,
        sortDirection: number,
        sortBy: string = this.DEFAULT_SORT_FIELD,
        searchNameTerm: string | null = null
    ): Promise<InterfaceGetBlogsWitchQuery> {

        const {countItems, sortField} = this.paginationHandler(pageNumber, pageSize, sortBy, sortDirection)
        const findNameTerm = searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {}

        const count: number = await blogsModel.countDocuments(findNameTerm)
        const blogs = await blogsModel.find(findNameTerm)
            .select(this.PROJECTION)
            .sort(sortField)
            .skip(countItems)
            .limit(pageSize)
            .lean()

        return {
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: count,
            items: blogs
        }


    }
    async getBlogById(id: string) {
        return blogsModel.findOne({id: id}).select(this.PROJECTION);
    }
    async getPostsInBlog(pageNumber: number = 1, pageSize: number = 10, sortDirection: number, sortBy: string = this.DEFAULT_SORT_FIELD, id: string): Promise<WithId<any>> {
        const findBlog = await blogsModel.findOne({id: id})
        if (findBlog === null) {
            return null
        }
        const count: number = await postsModel.countDocuments({blogId: id})
        const {countItems, sortField} = this.paginationHandler(pageNumber, pageSize, sortBy, sortDirection)
        const posts = await postsModel.find({blogId: id})
            .select(this.PROJECTION)
            .sort(sortField)
            .skip(countItems)
            .limit(pageSize)
            .lean()
        return {
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: count,
            items: posts
        }
    }
    paginationHandler(pageNumber: number, pageSize: number, sortBy: string, sortDirection: number) {

        const countItems = (pageNumber - 1) * pageSize;
        let sortField: any = {}
        sortField[sortBy] = sortDirection

        return {
            countItems,
            sortField
        }
    }
}

