import { ReservesService } from '../reserves'

export class PoolsService {
	private solendAPI: string
	private reservesService: ReservesService

	constructor() {
		this.solendAPI = process.env.SOLEND_API! + '/user-overview?wallet='
		this.reservesService = new ReservesService()
	}

	async getPools(wallet: string): Promise<any[]> {
		let pools: any[] = []

		const response = await fetch(this.solendAPI + wallet)

		const result = await response.json()

		try {
			const poolsIds = Object.keys(result)

			for (const poolId of poolsIds) {
				const pool = result[poolId]
				if (pool) {
					const { reserves } = await this.reservesService.getReserves(
						pool['lendingMarket']
					)

					const updatedDeposits = []
					let totalDepositValueUSD = 0
					let borrowLimit = 0
					let liquidationAt = 0

					for (const deposit of pool['deposits']) {
						const reserve = reserves[deposit['mint']]
						if (reserve) {
							const depositedAmount = Number(deposit['depositedAmount'])
							const ltv = reserve['attributes']['loanToValueRatio']
							const liquidationThreshold =
								reserve['attributes']['liquidationThreshold']
							const valueUSD = depositedAmount * reserve['price']

							totalDepositValueUSD += valueUSD
							borrowLimit += (valueUSD * ltv) / 100
							liquidationAt += (valueUSD * liquidationThreshold) / 100

							updatedDeposits.push({
								...deposit,
								ltv,
								liquidationThreshold,
								pricePerTokenInUSD: reserve['price'],
								valueUSD,
								depositedAmount,
							})
						}
					}

					pool['depositValueUSD'] = totalDepositValueUSD
					pool['borrowLimit'] = borrowLimit
          pool['avgBorrowLimitThreshold'] = borrowLimit / totalDepositValueUSD
					pool['liquidationAt'] = liquidationAt
          pool['avgLiquidationThreshold'] = liquidationAt / totalDepositValueUSD
					pool['deposits'] = updatedDeposits

					const updatedBorrows = []
					let totalWeightedBorrow = 0

					for (const borrow of pool['borrows']) {
						const reserve = reserves[borrow['mint']]
						if (reserve) {
							let borrowWeight = 1

							const addedBorrowWeightBPS = Number(
								reserve['attributes']['addedBorrowWeightBPS']
							)

							if (addedBorrowWeightBPS > 0) {
								borrowWeight += addedBorrowWeightBPS / 10000
							}

							const borrowedAmount = Number(borrow['borrowedAmount'])
							const valueUSD = borrowedAmount * reserve['price']

							totalWeightedBorrow += valueUSD * borrowWeight

							updatedBorrows.push({
								...borrow,
								borrowWeight,
								pricePerTokenInUSD: reserve['price'],
								valueUSD,
								borrowedAmount,
							})
						}
					}

					pool['borrowValueUSD'] = totalWeightedBorrow
					pool['borrows'] = updatedBorrows
          pool['healthFactor'] = liquidationAt / totalWeightedBorrow

					pools.push(pool)
				}
			}
		} catch (error) {
			console.error('Failed to fetch pools:', error)
		}

		return pools
	}
}
