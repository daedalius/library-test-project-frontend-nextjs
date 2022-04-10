export interface IBookSearchCriteria {
  ids?: string[];
  substring?: string;
  authorIds?: string[];
  available?: boolean;
  latest?: number;
}
