import {IErrorMessage} from "./Interface-error";

export interface IResultUserService<T> {
	data: T | null
	errorsMessages:IErrorMessage[] | null
	isSuccess: boolean //code: 0 | 1 | 2
}