describe('CatalogueTest', () => {

    beforeEach(() => {
        cy.visit('http://localhost:19006/productos');
    });

    it('H1 is present.', () => {
        cy.contains('Comparator');
    });

    it('El catálogo contiene productos', () => {
        cy.get('.App').within(() => {
            cy.get('.MuiGrid-container').should('exist');
            cy.get('.MuiGrid-item').should('have.length.greaterThan', 0);
        });
    });

    it('Filtrado de productos por SearchBar', () => {
        cy.wait(1000);

        cy.get('input[placeholder="Refina la búsqueda de tus productos..."]').type('Cereales');

        cy.get('input[placeholder="Refina la búsqueda de tus productos..."]').type('{enter}');

        cy.get('[class*="ProductCard"]').each(($el) => {
            cy.wrap($el).should('contain.text', 'Cereales');
        });
    });

    it('Filtrado de productos por ComboBox', () => {
        cy.get('[data-testid="combobox"]').click();

        cy.get('ul[role="listbox"] li').contains('Alimerka').click();

        cy.wait(1000);

        cy.get('[class*="ProductCard"]').each(($el) => {
            cy.wrap($el)
                .find('img')
                .invoke('attr', 'alt')
                .then((altText) => {
                    expect(altText.toLowerCase()).to.include('alimerka');
                });
        });
    });
})