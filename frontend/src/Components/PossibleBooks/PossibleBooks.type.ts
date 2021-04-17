import { ExternalBook } from 'src/@types';

export default interface PassedProps {
  isbn: string;
}

export interface Props {
  books: ExternalBook[];
}
