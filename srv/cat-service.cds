using my.bookshop as my from '../db/schema';


service CatalogService {
    @odata.draft.enabled
    entity Books as projection on my.Books;
     @odata.draft.enabled
     @odata.draft.bypass
    entity Authors as projection on my.Authors;
}
