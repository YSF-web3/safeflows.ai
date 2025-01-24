import { Price } from '@/types/solend'

type SolendPriceResponse = {
	symbol: string
	price: string
  mint: string
  identifier: string
}

type SolendPricesResponse = {
	results: SolendPriceResponse[]
}

export class PricesService {
	private solendPricesUrl: string

	constructor() {
		this.solendPricesUrl = process.env.SOLEND_GLOBAL_API! + '/v1/prices?symbols='
	}

	async getPrices(symbols: string): Promise<Price[]> {
		let prices: Price[] = []

		const response = await fetch(this.solendPricesUrl + symbols)

		const { results } = (await response.json()) as SolendPricesResponse

    prices = results.map((result) => {
      return {
        price: parseFloat(result.price),
        symbol: result.symbol,
        mint: result.mint,
      }
    })

		return prices
	}
}
