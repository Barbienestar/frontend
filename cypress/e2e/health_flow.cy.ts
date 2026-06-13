describe('Flujo de usuario salud', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();

    cy.login('healthLeote@tests.testing', 'Testing123.', 'health');
  });

  it('Ver dashboard y descargar plantilla de carga de stock', () => {
    cy.visit('/dashboard');
    cy.url().should('contain', '/dashboard');

    cy.contains('Análisis de Disponibilidad de Medicamentos').should(
      'be.visible'
    );

    cy.contains('Descarga la plantilla aquí')
      .should('have.attr', 'href', '/csvTemplate/formato_abasto.csv')
      .and('have.attr', 'download');

    cy.request('/csvTemplate/formato_abasto.csv').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.contain('text/csv');
    });
  });
});
