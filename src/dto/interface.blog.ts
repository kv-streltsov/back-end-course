export interface InterfaceBlog {
    id:string,
    name: string,
    description: string,
    websiteUrl: string
}

export interface InterfaceBlogInput {
    name:string        //maxLength: 15
    description:string //maxLength: 500
    websiteUrl:string  //maxLength: 500 URL
}

export interface InterfaceBlogView{
    id:string

    name:string
    description: string
    websiteUrl:string

    createdAt:string     //($date-time)
    isMembership:boolean // default false
}

