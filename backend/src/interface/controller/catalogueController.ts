import { wrapError } from 'src/@types';
import { CatalogueInteractor } from 'src/usecases/interactor';
import { IContext } from './context';

export default class CatalogueController {
  private catalogueInteractor: CatalogueInteractor;

  constructor(catalogueInteractor: CatalogueInteractor) {
    this.catalogueInteractor = catalogueInteractor;
  }

  async findByISBNOrNull(context: IContext): Promise<void> {
    const { isbn } = context.request.params;

    const [catalogue, error] = await wrapError(
      this.catalogueInteractor.findByISBNOrNull(isbn),
    );

    if (error) {
      context.next(error);
      return;
    }

    if (!catalogue) {
      context.response.send(404).json({ message: 'Libro no exisitente en el catálogo.' });
      return;
    }

    context.response.status(200).json({ catalogue });
  }
}
