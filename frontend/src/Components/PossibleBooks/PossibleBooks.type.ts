import { Catalogue, ExternalBook } from 'src/@types';

export default interface PassedProps {
  isbn: string;
  setSelected: React.Dispatch<React.SetStateAction<{
    selected: Catalogue | ExternalBook | undefined;
    type: 'catalogue' | 'external' | undefined;
  }>>;
}

export interface Props {
  externalBooks: ExternalBook[];
  internalBook: Catalogue | undefined;
  isLoading: boolean;
  setSelected: React.Dispatch<React.SetStateAction<{
    selected: Catalogue | ExternalBook | undefined;
    type: 'catalogue' | 'external' | undefined;
  }>>;
}
