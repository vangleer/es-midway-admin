export const BASE_URL = '/v1'
export const TIME_OUT = 50000

export const title = import.meta.env.VITE_APP_TITLE

export function viewList() {
	const files = import.meta.glob('/**/views/**/*.vue', { eager: true })
	let list: any = []

	for (const i in files) {
		if (!i.includes('components')) {
			list.push({
				value: i.substring(5)
			})
		}
	}

	return list
}

