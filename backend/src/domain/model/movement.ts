import CommonType from './common';

type Movement = CommonType & {
  idLocalBook: string;
  amount: number;
  isLoan: boolean;
};

export default Movement;
