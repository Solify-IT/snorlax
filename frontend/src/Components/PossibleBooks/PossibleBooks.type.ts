import { Catalogue, ExternalBook } from 'src/@types';

export default interface PassedProps {
  isbn: string;
}

export interface Props {
  externalBooks: ExternalBook[];
  internalBook: Catalogue | undefined;
  isLoading: boolean;
}
