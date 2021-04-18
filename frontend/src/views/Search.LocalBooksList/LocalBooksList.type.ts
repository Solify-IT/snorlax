import { Book } from 'src/@types';

export default interface Props {
  isLoading: boolean;
  books: Book[];
  setPagination: (pagination: { page: number, perPage: number }) => void;
  pagination: { page: number, perPage: number };
  total: number;
}
