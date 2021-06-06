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

export type InventoryCSV = {
  id: any;
  TITULO: string;
  ISBN: string;
  PRECIO: string;
  COSTO_UNITARIO: string;
  EXISTENCIA: string;
  AUTOR: string;
  EDITORIAL: string;
  AREA: string;
  TEMA: string;
  SUBTEMA: string;
  COLECCION: string;
  PROVEEDOR: string;
  TIPO_PRODUCTO:string;
  ENCUADERNACION: string;
  SUBCATEGORIA: string;
  DISTRIBUIDOR: string;
  SINOPSIS: string;
  PAGINAS: string;
  CONSGINA?: string;
  URL: string;
};

type Catalogue = CommonType & CatalogueInputData;

export const CATALOGUE_TABLE_NAME = 'catalogue';

export default Catalogue;
