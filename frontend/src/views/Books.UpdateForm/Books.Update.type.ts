import { Book } from 'src/@types';

export default interface Props {
  book: Book;
  isLoading:boolean;
  onFinish:(values: any) => void;
  onFinishFailed:(values: any) => void;
}

export type StateType = {
  isbn: string;
  price: number;
  amount: number;
  newAmount: number;
  isLoan: boolean;
};
