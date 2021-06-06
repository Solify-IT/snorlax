import CommonType from './common';

export type CatalogueInputData = {
  title: string;
  isbn: string;
  unitaryCost: number;
  author: string;
  editoral: string
  area: string;
  theme: string;
  subTheme: string;
  collection: string;
  provider: string;
  type: string;
  coverType: string;
  coverImageUrl: string;
  subCategory: string;
  distribuitor: string;
  synopsis: string;
  pages: number;
  libraryName: string;
  libraryPhone: string;
};

type Catalogue = CommonType & CatalogueInputData;

export const CATALOGUE_TABLE_NAME = 'catalogue';

export default Catalogue;
