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

