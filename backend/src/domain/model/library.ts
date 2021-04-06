import CommonType from './common';

export type Library = CommonType & {
  name: string;
  phoneNumber: string;
  email: string;
  state: string;
  city: string;
  address: string;
  inCharge: string;
};

export const LIBRARY_TABLE_NAME = 'libraries';
