describe('Flujo de usuario administrador', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();

    // Create dummy report
    cy.login('citizen@tests.testing', 'Testing123.', 'citizen');

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
      'TEST: REPORT CREATION FOR ADMIN FLOW'
    );
    // Upload prescription
    cy.get("[data-testid='report-prescription-upload']").selectFile(
      'cypress/fixtures/prescription.png',
      { force: true }
    );

    // Intercept BEFORE clicking submit
    cy.intercept('POST', '**/reports**').as('createReport');

    // Check submit button is enabled and click it
    cy.get("[data-testid='report-submit-button']")
      .should('not.be.disabled')
      .click();
    // Check confirmation modal is visible
    cy.get("[data-testid='confirmation-modal']").should('be.visible');
    cy.get("[data-testid='confirmation-modal-confirm-button']").click();

    // Wait for the actual API call to complete before proceeding
    cy.wait('@createReport').its('response.statusCode').should('eq', 201);

    // Login as admin
    cy.login('adminbarbienestardeploy@gmail.com', 'barboAdmin123', 'admin');
  });

  it('Rechazar un reporte', () => {
    cy.visit('/admin');
    cy.url().should('contain', '/admin');

    cy.contains('TEST: REPORT CREATION FOR ADMIN FLOW')
      .parents('.group.relative.flex')
      .first()
      .within(() => {
        cy.get("[data-testid='admin-reject-report-button']").click();
        cy.get("[data-testid='confirmation-modal']").should('be.visible');
        cy.get("[data-testid='confirmation-modal-confirm-button']").click();
      });

    cy.contains('TEST: REPORT CREATION FOR ADMIN FLOW').should('not.exist');
  });

  it('Aceptar un reporte', () => {
    cy.visit('/admin');
    cy.url().should('contain', '/admin');

    cy.contains('TEST: REPORT CREATION FOR ADMIN FLOW')
      .parents('.group.relative.flex')
      .first()
      .within(() => {
        cy.get("[data-testid='admin-accept-report-button']").click();
        cy.get("[data-testid='confirmation-modal']").should('be.visible');
        cy.get("[data-testid='confirmation-modal-confirm-button']").click();
      });

    cy.contains('TEST: REPORT CREATION FOR ADMIN FLOW').should('not.exist');
  });
});
