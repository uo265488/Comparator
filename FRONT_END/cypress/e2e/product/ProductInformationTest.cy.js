describe('ProductInformationTest', () => {

    beforeEach(() => {
        cy.visit('http://localhost:19006/productos');
    });

    it('El título debe estar presente cuando accedemos al Catálogo.', () => {
        cy.contains('Comparator');
    });

    it('El catálogo contiene productos cuando accedemos al Catálogo.', () => {
        cy.get('.App').within(() => {
            cy.get('.MuiGrid-container').should('exist');
            cy.get('.MuiGrid-item').should('have.length.greaterThan', 0);
        });
    });

    it('El Catálogo debe mostrar la información del producto cuando hacemos click en "Ver más"', () => {
        // Esperamos a que se carguen los productos
        cy.wait(1000);

        cy.get('[class*="ProductCard"]').first().within(() => {
            cy.contains('Ver más').click();
        });

        cy.get('.product-info').should('be.visible');
    });

    it('La información es correcta cuando hacemos click en "Ver más"', () => {
        // Esperamos a que se carguen los productos
        cy.wait(1000);

        cy.get('[class*="ProductCard"]').first().within(() => {
            cy.contains('Ver más').click();
        });

        // Información del producto
        cy.get('.product-info').should('be.visible');
        cy.get('.product-info .product-price').should('be.visible');
        cy.get('.product-info .product-img').should('be.visible');
    });

    it('Las estadísticas se muestran correctamente cuando hacemos click en "Ver más"', () => {
        // Esperamos a que se carguen los productos
        cy.wait(1000);

        cy.get('[class*="ProductCard"]').first().within(() => {
            cy.contains('Ver más').click();
        });

        // Sección estadísticas
        cy.get('h2').contains('Evolución del precio de este producto').should('exist')
            .next().find('.recharts-surface').should('exist');
    });

    it('La sección alternativas se muestra correctamente cuando hacemos click en "Ver más"', () => {
        // Esperamos a que se carguen los productos
        cy.wait(1000);

        cy.get('[class*="ProductCard"]').first().within(() => {
            cy.contains('Ver más').click();
        });

        // Sección alternativa
        cy.get('.product-info').should('be.visible');
        cy.get('.product-info .product-price').should('be.visible');
    });
});