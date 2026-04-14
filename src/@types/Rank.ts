import type { RankCategory } from "./RankCategory";

export type Rank = {
  rankId?: number;
  rankCode?: string;
  rankName?: string;
  rankLevel?: number;
  rankCategoryId?: number;
  rankCategory?: RankCategory;
};
