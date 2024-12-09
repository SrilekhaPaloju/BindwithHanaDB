using CatalogService as service from '../../srv/cat-service';

annotate service.Books with @(UI: {
    SelectionFields             : [
        ID,
        title,
        stock
    ],
    LineItem                    : [
        {
            $Type: 'UI.DataField',
            Value: ID
        },
        {
            $Type: 'UI.DataField',
            Value: title
        },
        {
            $Type: 'UI.DataField',
            Value: stock
        },
    ],
    FieldGroup #Booksinformation: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: ID
            },
            {
                $Type: 'UI.DataField',
                Value: title
            },
            {
                $Type: 'UI.DataField',
                Value: stock
            }
        ]
    },

});

annotate service.Authors with @(
    UI.FieldGroup #authors: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: ID
            },
            {
                $Type: 'UI.DataField',
                Value: name
            },
            {
                $Type: 'UI.DataField',
                Value: bio
            }
        ]
    },
);


annotate service.Books with @(UI.Facets: [
    {
        $Type : 'UI.ReferenceFacet',
        ID    : 'BooksinformationFacet',
        Label : 'Books Information',
        Target: ![@UI.FieldGroup#Booksinformation]
    },
    {
        $Type : 'UI.ReferenceFacet',
        ID    : 'AuthorInformationFacet',
        Label : 'Author Information',
        Target: 'author/@UI.FieldGroup#authors'
    }
]);
