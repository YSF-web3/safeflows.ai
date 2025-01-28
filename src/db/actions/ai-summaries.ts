import { AISummary } from "@/db/models"
import { ISummary } from "@/db/types"

export const getAiSummaries = async (address: string) => {
	return await AISummary.find({ address });
};

export const getAiSumamry = async (address: string) => {
	return await AISummary.findOne({ address });
};
  

export const createSummary = async (address: string, analysis: string, warnings:string[], suggestions:string[]) => {
	return await AISummary.create({ address, analysis, suggestions, warnings });

}

export const updateSummary = async (address: string, analysis: string, warnings:string[], suggestions:string[]) => {
	return await AISummary.updateOne( { address },
		{ updatedAt: new Date(), analysis, warnings, suggestions  })
}
