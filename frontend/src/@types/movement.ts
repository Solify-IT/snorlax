import CommonType from './common';

type Movement = CommonType & {
  localBookId: string;
  amount: number;
  type:string;
  isLoan: boolean;
};

export type AggregatedSale = {
  fecha: string;
  totalCount: string;
  total: string;
};

export type TodaySale = {
  sale: Array<AggregatedSale>;
};

export type MovementInputData = Omit<Movement, 'id'>;

export const MOVEMENT_TABLE_NAME = 'movements';

export default Movement;
