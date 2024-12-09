sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/app/fiorielement/test/integration/FirstJourney',
		'com/app/fiorielement/test/integration/pages/BooksList',
		'com/app/fiorielement/test/integration/pages/BooksObjectPage'
    ],
    function(JourneyRunner, opaJourney, BooksList, BooksObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/app/fiorielement') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheBooksList: BooksList,
					onTheBooksObjectPage: BooksObjectPage
                }
            },
            opaJourney.run
        );
    }
);