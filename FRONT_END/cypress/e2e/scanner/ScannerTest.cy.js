describe('ScannerTest', () => {

    beforeEach(() => {
        cy.visit('http://localhost:19006/scanner');
    });

    it('Debería mostrarse título cuando abrimos el Scanner', () => {
        cy.contains('Scanner de código de barras');
    });

    it('Debe existir un Input field para el código de barras cuando iniciamos el Scanner', () => {
        cy.contains('Código de barras:').parent().find('input').should('exist');
    });

    it('Debe permitir escribir en el Input field', () => {
        const testBarcode = '1234567890';
        cy.contains('Código de barras:').parent().find('input').type(testBarcode);
        cy.contains('Código de barras:').parent().find('input').should('have.value', testBarcode);
    });

    it('Debe mostrar el formulario registro cuando registramos el nuevo barcode', () => {
        const testBarcode = '1234567890';
        cy.contains('Código de barras:').parent().find('input').type(testBarcode);
        cy.contains('Código de barras:').parent().find('input').should('have.value', testBarcode);

        //Apretamos el boton de registrar codigo de barras
        cy.get('[style="background-color: rgb(103, 80, 164); box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px; min-width: 64px; border-style: solid; border-color: rgba(0, 0, 0, 0); border-width: 0px; border-radius: 20px; margin-bottom: 10px;"]')
            .click();

        //Esperamos por la respuesta de la REST_API
        cy.wait(1000);

        cy.contains("Añade un producto no registrado a nuestra base de datos");
    });

    it('Debe rellenar el formulario de registro correctamente', () => {
        const testBarcode = '1234567890';
        cy.contains('Código de barras:').parent().find('input').type(testBarcode);
        cy.contains('Código de barras:').parent().find('input').should('have.value', testBarcode);

        //Apretamos el boton de registrar codigo de barras
        cy.get('[style="background-color: rgb(103, 80, 164); box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px; min-width: 64px; border-style: solid; border-color: rgba(0, 0, 0, 0); border-width: 0px; border-radius: 20px; margin-bottom: 10px;"]')
            .click();

        //Esperamos por la respuesta de la REST_API
        cy.wait(1000);

        cy.contains("Añade un producto no registrado a nuestra base de datos");

        // Rellenamos el formulario
        cy.get('#nombre').type("Producto PRUEBAS");
        cy.get('#precio').type("5");
        cy.get('#supermercado').click();
        cy.get('#menu- > .MuiPaper-root > .MuiList-root > [tabindex="0"]').click();
        cy.get('#marca').type("Marca PRUEBAS");
        cy.get('#proveedor').type("Proveedor PRUEBAS");
    });

    it('Debe mostrar el dialogo de confirmacion cuando clickamos en "Registrar producto" y los datos están validados.', () => {
        const testBarcode = '1234567890';
        cy.contains('Código de barras:').parent().find('input').type(testBarcode);
        cy.contains('Código de barras:').parent().find('input').should('have.value', testBarcode);

        //Apretamos el boton de registrar codigo de barras
        cy.get('[style="background-color: rgb(103, 80, 164); box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px; min-width: 64px; border-style: solid; border-color: rgba(0, 0, 0, 0); border-width: 0px; border-radius: 20px; margin-bottom: 10px;"]')
            .click();

        //Esperamos por la respuesta de la REST_API
        cy.wait(1000);

        cy.contains("Añade un producto no registrado a nuestra base de datos");

        // Rellenamos el formulario
        cy.get('#nombre').type("Producto PRUEBAS");
        cy.get('#precio').type("5");
        cy.get('#supermercado').click();
        cy.get('#menu- > .MuiPaper-root > .MuiList-root > [tabindex="0"]').click();
        cy.get('#marca').type("Marca PRUEBAS");
        cy.get('#proveedor').type("Proveedor PRUEBAS");
        
        //Apretamos el boton de Registrar producto
        cy.contains('button', 'Registrar producto').click();

        //Se abre el dialogo de registro
        cy.contains('Confirmación de registro');
    });

    it('Debe mostrar el alerta Éxito cuando confirmamos el registro.', () => {
        const testBarcode = '1234567890';
        cy.contains('Código de barras:').parent().find('input').type(testBarcode);
        cy.contains('Código de barras:').parent().find('input').should('have.value', testBarcode);

        //Apretamos el boton de registrar codigo de barras
        cy.get('[style="background-color: rgb(103, 80, 164); box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px; min-width: 64px; border-style: solid; border-color: rgba(0, 0, 0, 0); border-width: 0px; border-radius: 20px; margin-bottom: 10px;"]')
            .click();

        //Esperamos por la respuesta de la REST_API
        cy.wait(1000);

        cy.contains("Añade un producto no registrado a nuestra base de datos");

        // Rellenamos el formulario
        cy.get('#nombre').type("Producto PRUEBAS");
        cy.get('#precio').type("5");
        cy.get('#supermercado').click();
        cy.get('#menu- > .MuiPaper-root > .MuiList-root > [tabindex="0"]').click();
        cy.get('#marca').type("Marca PRUEBAS");
        cy.get('#proveedor').type("Proveedor PRUEBAS");
        
        //Apretamos el boton de Registrar producto
        cy.contains('button', 'Registrar producto').click();

        //Se abre el dialogo de registro
        cy.contains('Confirmación de registro');

        //Confirmamos el registro
        cy.contains('button', 'Si').click();

        //Se muestra alerta de confimación de registro
        cy.get('.MuiAlert-icon').should('exist');

        //Muestra la alerta 'Esta es la mejor alternativa posible'
        cy.get('.MuiAlert-message')
            .should('contain.text', 'El Producto se ha registrado en nuestra base de datos correctamente, ¡Muchas gracias!');       
        
    });

    it('Debería existir el producto PRUEBAS cuando buscamos en el Catálogo', () => {
        cy.visit('http://localhost:19006/productos');

        cy.contains('Producto PRUEBAS');
    });

    it('Debe resetear el código cuando apretamos "Resetear".', () => {
        const testBarcode = '1234567890';
        cy.contains('Código de barras:').parent().find('input').type(testBarcode);
        //Apretamos el boton Resetear
        cy.get('[style="background-color: rgb(103, 80, 164); box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px; min-width: 64px; border-style: solid; border-color: rgba(0, 0, 0, 0); border-width: 0px; border-radius: 20px;"]')
            .click({ force: true });
        // Comprobamos el text input esta vacio
        cy.contains('Código de barras:').parent().find('input').should('have.value', '');
    });

});