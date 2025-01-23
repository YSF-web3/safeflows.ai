export class PoolsService {
	private solendAPI: string

	constructor() {
		this.solendAPI = process.env.SOLEND_API!
	}

	async getPools(wallet: string): Promise<any[]> {
		let pools: any[] = []

		const response = await fetch(this.solendAPI + '/user-overview?wallet=' + wallet)

		const result = await response.json()

		try {
			const poolsIds = Object.keys(result)

			for (const poolId of poolsIds) {
				const pool = result[poolId]

				if (pool) {
					pools.push(pool)
				}
			}
		} catch (error) {
			console.error('Failed to fetch pools:', error)
		}

		return pools
	}
}
