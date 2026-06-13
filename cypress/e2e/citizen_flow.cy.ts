describe('Flujo de usuario ciudadano NO autenticado', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();
  });

  it('Buscar un medicamento', () => {
    cy.visit('/mapa-de-abasto');
    cy.get("[data-testid='medicines-search-input']").type('metfor');
    cy.get("[data-testid='medicines-suggestion-text']").should('be.visible');
  });

  describe('Flujo de usuario ciudadano autenticado', () => {
    beforeEach(() => {
      cy.login('citizenleote@tests.testing', 'Testing123.');
    });

    it('Crear un reporte', () => {
      cy.visit('/reportar');
      cy.url().should('contain', '/reportar');
      // Check confirm modal does not exist yet
      cy.get("[data-testid='confirmation-modal']").should('not.exist');
      // Check submit button is disabled
      cy.get("[data-testid='report-submit-button']").should('be.disabled');
      // Select medicine
      cy.get("[data-testid='report-search-medicine-input']").click();
      cy.get("[data-testid='report-select-medicine-option-1']")
        .should('be.visible')
        .click();
      // Select hospital
      cy.get("[data-testid='report-search-hospital-input']").click();
      cy.get("[data-testid='report-select-hospital-option-1']")
        .should('be.visible')
        .click();
      // Add description
      cy.get("[data-testid='report-description-input']").type(
        'No hubo medicamento'
      );
      // Upload prescription
      cy.get("[data-testid='report-prescription-upload']").selectFile(
        'cypress/fixtures/prescription.png',
        { force: true }
      );
      // Check submit button is enabled and click it
      cy.get("[data-testid='report-submit-button']")
        .should('not.be.disabled')
        .click();
      // Check confirmation modal is visible
      cy.get("[data-testid='confirmation-modal']").should('be.visible');
      cy.get("[data-testid='confirmation-modal-confirm-button']").click();
    });
  });
});
