import CommonType from './common';

export type CatalogueInputData = {
  title: string;
  isbn: string;
  unitary_cost: number;
  author: string;
  editoral: string
  area: string;
  theme: string;
  sub_theme: string;
  collection: string;
  provider: string;
  type: string;
  cover: string;
  sub_category: string;
  distribuitor: string
  synopsis: string
  pages: number;
};

type Catalogue = CommonType & CatalogueInputData;

export default Catalogue;
