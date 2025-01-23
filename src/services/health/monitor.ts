import { SolendClient } from '@/services/solend/client'

export class HealthMonitorService {
	private solendClient: SolendClient

	constructor() {
		this.solendClient = new SolendClient()
	}

	async calculateHealthFactor(walletAddress: string): Promise<number> {
		const position = await this.solendClient.getUserPosition(walletAddress)

		let totalCollateralValue = 0
		let totalBorrowedValue = 0

		// Calculate total collateral value
		for (const collateral of position.collateral) {
			// const price = await this.priceService.getPrice(collateral.pythPriceAccount)
			// totalCollateralValue += collateral.amount * price
		}

		// Calculate total borrowed value
		for (const borrow of position.borrowed) {
			// const price = await this.priceService.getPrice(borrow.pythPriceAccount)
			// totalBorrowedValue += borrow.amount * price
		}

		return totalBorrowedValue === 0 ? Infinity : totalCollateralValue / totalBorrowedValue
	}

	getRiskLevel(healthFactor: number): 'SAFE' | 'WARNING' | 'DANGER' {
		if (healthFactor > 1.5) return 'SAFE'
		if (healthFactor > 1.2) return 'WARNING'
		return 'DANGER'
	}
}
