import api from "./apiClient";

export interface Similarity {
  ingredient: string;
  name: string;
  score: number;
}

export interface CrossReaction {
  _id: string;
  name: string;
  scientificName?: string;
  proteinSequence?: string;
  similarities: Similarity[];
  ingredient: string;
}

export const crossReactionsService = {
  getCrossReactions: (ingredientId: string) => {
    return api.get<CrossReaction[]>("/crossReaction/get/" + ingredientId);
  }
};
