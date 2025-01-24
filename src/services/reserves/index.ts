import { PricesService } from '../prices'

export class ReservesService {
	private solendAPI: string
	private pricesService: PricesService

	constructor() {
		this.solendAPI = process.env.SOLEND_GLOBAL_API! + '/reserves/config-changes?marketID='
		this.pricesService = new PricesService()
	}

	async getReserves(market: string): Promise<{ [key: string]: any }> {
		let reserves: { [key: string]: any } = {}
		let tokenSymbols: string[] = []
		let lastUpdatedSlot = 0

		const response = await fetch(this.solendAPI + market)

		const { results } = await response.json()

		if (!results) return []

		try {
			const orderedBySlotResults = results.sort((a: any, b: any) => a.slot - b.slot)

			for (const result of orderedBySlotResults) {
				const { token, signature, timestamp, slot, changes, ...restReserve } = result

				if (!reserves[token.mint]) {
					const { mint, ...restTokenInfo } = token
					tokenSymbols.push(restTokenInfo.symbol)
					reserves[token.mint] = { ...restTokenInfo, ...restReserve }
					reserves[token.mint]['attributes'] = {}
				}

				for (const change of changes) {
					const { attribute, newValue } = change
					reserves[token.mint]['attributes'][attribute] = newValue
				}
			}

			const prices = await this.pricesService.getPrices(tokenSymbols.join(','))

			for (const price in prices) {
				const p = prices[price]
				if (reserves[p.mint]) {
					reserves[p.mint]['price'] = p.price
				}
			}

			lastUpdatedSlot = orderedBySlotResults[orderedBySlotResults.length - 1].slot
		} catch (error) {
			console.error('Failed to fetch reserves:', error)
		}

		return { reserves, lastUpdatedSlot }
	}
}
