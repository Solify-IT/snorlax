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
  cover: string;
  subCategory: string;
  distribuitor: string
  synopsis: string
  pages: number;
};

type Catalogue = CommonType & CatalogueInputData;

export default Catalogue;
