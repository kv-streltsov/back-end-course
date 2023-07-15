export interface IDeviceId{
	deviceId: string
}
export interface IDevice {
	userId: string
	deviceId: string
	iat: number
	exp: number
}

export interface IDeviceView {
	ip: string
	title: string
	lastActiveDate: string
	deviceId: string
}


export interface IDeviceDb {
	_id: any
	issued: string
	expiration: string
	userId: string
	deviceId: string
	userAgent: string
	ip: string
}

