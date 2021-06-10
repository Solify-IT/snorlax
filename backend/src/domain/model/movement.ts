import CommonType from './common';

type Movement = CommonType & {
  localBookId: string;
  amount: number;
  isLoan: boolean;
  total:number;
  type: 'Devolucion cliente'|'Compra'|'Venta'|'Devolucion Editorial'|'Actualizar';
};

export type ReportInput = {
  fechaInitial: any;
  fechaEnd: any;
  type: any;
  desglosado: any;
  libraryId: any;
};

export type ReportDailyInput = {
  fechaInitial: any;
  fechaEnd: any;
  type: any;
  desglosado: any;
  libraryId: any;
};

export type ReportDailyMovementInput = {
  movements: ReportDailyInput[];
};

export type ReportMovementInput = {
  movements: ReportInput[];
};

export type MovementInputData = Omit<Movement, 'id'>;

export const MOVEMENT_TABLE_NAME = 'movements';

export default Movement;
