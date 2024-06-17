describe('Comparator application', () => {

    beforeEach(() => {
        cy.visit('http://localhost:19006/lista');
    });

    it('Debería estar presente el Título cuando accedemos a la Lista.', () => {
        cy.contains('h1', 'Tu lista de la compra:').should('be.visible');
    });

    it('La Lista debería estar vacía cuando accedemos por primera vez.', () => {
        cy.wait(1000); //Esperamos por si tienen que cargar los productos en sesion

        cy.contains('No hay productos en la Lista.');

    });

    it('Debería añadir un producto a la Lista cuando pulsamos "Añadir a la Lista de la compra"', () => {
        cy.wait(1000); //Esperamos por si tienen que cargar los productos en sesion

        cy.contains('No hay productos en la Lista.');

        cy.visit('http://localhost:19006/productos');

        cy.get('.ProductCard').should('be.visible');

        cy.get(':nth-child(1) > [data-testid="card-container"] > [data-testid="card"] > .MuiCardActions-root > [style="background-color: rgb(103, 80, 164); box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px; min-width: 64px; border-style: solid; border-color: rgba(0, 0, 0, 0); border-width: 0px; border-radius: 20px;"] > [data-testid="button"] > .css-view-175oi2r')
            .click();// Click the "Añadir a la Lista de la compra" button on the first product card
    });

    it('Debería mostrar los productos cuando están en la Lista', () => {
        cy.wait(1000); //Esperamos por si tienen que cargar los productos en sesion

        cy.contains('No hay productos en la Lista.');

        cy.visit('http://localhost:19006/productos');

        cy.get('.ProductCard').should('be.visible');

        cy.get(':nth-child(1) > [data-testid="card-container"] > [data-testid="card"] > .MuiCardActions-root > [style="background-color: rgb(103, 80, 164); box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px; min-width: 64px; border-style: solid; border-color: rgba(0, 0, 0, 0); border-width: 0px; border-radius: 20px;"] > [data-testid="button"] > .css-view-175oi2r')
            .click();// Click the "Añadir a la Lista de la compra" button on the first product card

        cy.visit('http://localhost:19006/lista');

        cy.contains('No hay productos en la Lista.').should('not.exist');
    });

    it('Deberia mejorar alternativa cuando click en "BUSCAR MEJOR ALTERNATIVA"', () => {
        cy.wait(1000); //Esperamos por si tienen que cargar los productos en sesion

        cy.contains('No hay productos en la Lista.');

        cy.visit('http://localhost:19006/productos');

        cy.get('.ProductCard').should('be.visible');

        cy.get(':nth-child(1) > [data-testid="card-container"] > [data-testid="card"] > .MuiCardActions-root > [style="background-color: rgb(103, 80, 164); box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px; min-width: 64px; border-style: solid; border-color: rgba(0, 0, 0, 0); border-width: 0px; border-radius: 20px;"] > [data-testid="button"] > .css-view-175oi2r')
            .click();// Click the "Añadir a la Lista de la compra" button on the first product card

        cy.visit('http://localhost:19006/lista');

        //Hay productos en Lista
        cy.contains('No hay productos en la Lista.').should('not.exist');

        // No existe alerta antes de buscar alternativa
        cy.get('.MuiAlert-icon').should('not.exist');

        cy.get('.css-41xl6b-MuiButtonBase-root-MuiButton-root')
            .click(); //hacer click en mejorar alternativa

        //Ahora si existe alternativa
        cy.get('.MuiAlert-icon').should('exist');
    });

    it('Deberia mantener la alternativa cuando no existe una mejor alternativa', () => {
        cy.wait(1000); //Esperamos por si tienen que cargar los productos en sesion

        cy.contains('No hay productos en la Lista.');

        cy.visit('http://localhost:19006/productos');

        cy.get('.ProductCard').should('be.visible');

        cy.get(':nth-child(1) > [data-testid="card-container"] > [data-testid="card"] > .MuiCardActions-root > [style="background-color: rgb(103, 80, 164); box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px; min-width: 64px; border-style: solid; border-color: rgba(0, 0, 0, 0); border-width: 0px; border-radius: 20px;"] > [data-testid="button"] > .css-view-175oi2r')
            .click();// Click the "Añadir a la Lista de la compra" button on the first product card

        cy.visit('http://localhost:19006/lista');

        //Hay productos en Lista
        cy.contains('No hay productos en la Lista.').should('not.exist');

        // No existe alerta antes de buscar alternativa
        cy.get('.MuiAlert-icon').should('not.exist');

        cy.get('.css-41xl6b-MuiButtonBase-root-MuiButton-root')
            .click(); //hacer click en mejorar alternativa

        //Ahora si existe alerta
        cy.get('.MuiAlert-icon').should('exist');

        cy.get('.css-41xl6b-MuiButtonBase-root-MuiButton-root')
            .click(); //Hacemos click de nuevo sobre la mejor alternativa

        //Muestra la alerta 'Esta es la mejor alternativa posible'
        cy.get('.MuiAlert-message').should('contain.text', 'Este producto es la mejor de las alternativas.');
    });

    it('Deberia filtrar la alternatica por el supermercado correcto cuando esta marcado el filtro del supermercado.', () => {
        cy.wait(1000); //Esperamos por si tienen que cargar los productos en sesion

        cy.contains('No hay productos en la Lista.');

        cy.visit('http://localhost:19006/productos');

        cy.get('.ProductCard').should('be.visible');

        cy.get(':nth-child(1) > [data-testid="card-container"] > [data-testid="card"] > .MuiCardActions-root > [style="background-color: rgb(103, 80, 164); box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px; min-width: 64px; border-style: solid; border-color: rgba(0, 0, 0, 0); border-width: 0px; border-radius: 20px;"] > [data-testid="button"] > .css-view-175oi2r')
            .click();// Click the "Añadir a la Lista de la compra" button on the first product card

        cy.visit('http://localhost:19006/lista');

        //Hay productos en Lista
        cy.contains('No hay productos en la Lista.').should('not.exist');

        // No existe alerta antes de buscar alternativa
        cy.get('.MuiAlert-icon').should('not.exist');

        //Click en el ComboBox de supermercado
        cy.get('#select-helper').click();

        //Seleccionamos la opcion de Mercadona
        cy.get('[data-value="Mercadona"]').click();

        cy.get('.css-41xl6b-MuiButtonBase-root-MuiButton-root')
            .click(); //hacer click en mejorar alternativa

        //Ahora si existe alerta
        cy.get('.MuiAlert-icon').should('exist');

        //El nuevo producto pertenece a Mercadona
        cy.get(':nth-child(1) > img')
        .should('have.attr', 'alt')
        .and('contain', 'Mercadona');
    });

})