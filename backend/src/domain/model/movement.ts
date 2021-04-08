import CommonType from './common';

type Movement = CommonType & {
  idLocalBook: string;
  amount: number;
  isLoan: boolean;
};

export type MovementInputData = Omit<Movement, 'id'>;

export default Movement;
