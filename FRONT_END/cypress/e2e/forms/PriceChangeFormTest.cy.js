describe('PriceChangeFormTest', () => {

    beforeEach(() => {
        cy.visit('http://localhost:19006/productos');
    });

    it('Título está presente cuando accedemos al Catálogo.', () => {
        cy.contains('Comparator');
    });

    it('Contiene productos cuando accedemos al Catálogo', () => {
        cy.get('.App').within(() => {
            cy.get('.MuiGrid-container').should('exist');
            cy.get('.MuiGrid-item').should('have.length.greaterThan', 0);
        });
    });

    it('Debe mostrar la información del producto al hacer clic en "Ver más"', () => {
        // Esperar a que se carguen los productos
        cy.wait(1000);

        cy.get('[class*="ProductCard"]').first().within(() => {
            cy.contains('Ver más').click();
        });

        cy.get('.product-info').should('be.visible');
    });

    it('Debe insertar precio en el formulario al hacer clic en el TextInput', () => {
        // Esperar a que se carguen los productos
        cy.wait(1000);

        cy.get('[class*="ProductCard"]').first().within(() => {
            cy.contains('Ver más').click();
        });

        cy.get('.product-info').should("be.visible");

        cy.get('.MuiGrid-container > :nth-child(1) > .MuiPaper-root > :nth-child(1) > .product-info > :nth-child(6)').click({ force: true });

        cy.get('#precio').type('3');    
    });

    it('Debe desplegar dialogo de confirmación al hacer clic en el REGISTRAR SUBIDA DE PRECIO', () => {
        // Esperar a que se carguen los productos
        cy.wait(1000);

        cy.get('[class*="ProductCard"]').first().within(() => {
            cy.contains('Ver más').click();
        });

        cy.get('.product-info').should("be.visible");

        cy.get('.MuiGrid-container > :nth-child(1) > .MuiPaper-root > :nth-child(1) > .product-info > :nth-child(6)').click({ force: true });

        cy.get('#precio').type('3');    
    });


    it('Debe completar al registro al realizar todo el proceso correctamente.', () => {
        // Esperar a que se carguen los productos
        cy.wait(1000);

        cy.get('[class*="ProductCard"]').first().within(() => {
            cy.contains('Ver más').click();
        });

        cy.get('.product-info').should("be.visible");

        cy.get('.MuiGrid-container > :nth-child(1) > .MuiPaper-root > :nth-child(1) > .product-info > :nth-child(6)').click({ force: true });

        cy.get('#precio').type('3');

        cy.get('.css-1frn65h-MuiGrid-root > .MuiButtonBase-root').click(); //Click en Registrar subida de precio

        cy.get('.MuiGrid-root > .MuiBox-root > :nth-child(1)').click();

        cy.wait(1000);

        cy.contains('El cambio de precio se ha registrado en nuestra base de datos correctamente, ¡Muchas gracias!');
    });

})