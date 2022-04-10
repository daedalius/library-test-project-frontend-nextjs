export interface IBookDto {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  authorIds: string[];
}
