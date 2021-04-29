import { Book } from 'src/@types';

export default interface Props {
  book: Book | undefined;
  isLoading:boolean;
}
