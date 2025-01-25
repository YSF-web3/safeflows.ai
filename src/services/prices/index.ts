import { createPrediction, getPrediction } from '@/db/actions/prediction'
import { Prediction } from '@/types/ai'
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
	private dexScreenerUrl: string

	constructor() {
		this.solendPricesUrl = process.env.SOLEND_GLOBAL_API! + '/v1/prices?symbols='
		this.dexScreenerUrl = process.env.DEXSCREENER_API! + '/latest/dex/tokens/'
	}

	async getPrices(symbols: string): Promise<Price[]> {
		let prices: Price[] = []

		const response = await fetch(this.solendPricesUrl + symbols)

		const { results } = (await response.json()) as SolendPricesResponse

		prices = results.map(result => {
			return {
				price: parseFloat(result.price),
				symbol: result.symbol,
				mint: result.mint,
			}
		})

		return prices
	}

	async getPredictions(mints: string): Promise<Prediction> {
		let predictions: Prediction = {}

		for (const mint of mints.split(',')) {
			const predictionExists = await getPrediction(mint)

			if (
				!predictionExists ||
				(predictionExists &&
					predictionExists.updatedAt.getTime() < Date.now() - 1000 * 60 * 60)
			) {
				const response = await fetch(this.dexScreenerUrl + mint)
				const { pairs } = await response.json()

				if (!pairs) continue

				const { baseToken, priceUsd, txns, volume, priceChange, liquidity, fdv } = pairs[0]

				const tokenData = {
					...baseToken,
					priceUsd: Number(priceUsd),
					txns,
					volume,
					priceChange,
					liquidity,
					fdv,
				}

				// const prediction = await aiModel.predict(tokenData)
				// predictions[mint] = prediction
				
				// Mocked prediction
				predictions[mint] = tokenData.priceUsd
				
				await createPrediction(mint, predictions[mint])
			} else {
				predictions[mint] = predictionExists.price
			}
		}

		return predictions
	}
}
