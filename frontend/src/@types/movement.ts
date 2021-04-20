import CommonType from './common';

type Movement = CommonType & {
  localBookId: string;
  amount: number;
  isLoan: boolean;
};

export type MovementInputData = Omit<Movement, 'id'>;

export const MOVEMENT_TABLE_NAME = 'movements';

export default Movement;