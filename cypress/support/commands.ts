/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
// Cypress.Commands.add("login", (email, password, role: "admin" | "citizen" = "citizen") => {
//     // 1. Force clear EVERYTHING before doing anything else
//     cy.clearAllCookies();
//     cy.clearAllLocalStorage();
//     cy.clearAllSessionStorage();

//     cy.intercept("GET", "**/auth/me").as("authCheck")

//     cy.visit("/inicio")
//     cy.get("[data-testid='login-navigate-index-button']").click()
//     cy.get("[data-testid='login-email-input']").should("exist").type(email)
//     cy.get("[data-testid='login-password-input']").should("exist").type(password)
//     cy.get("[data-testid='login-submit-button']").should("exist").click()

//     cy.wait("@authCheck").its("response.statusCode").should("eq", 200)

//     cy.get("[data-testid='navbar-profile-button']").should("be.visible")

//     if (role === "admin") {
//         // Admins should see the "Dashboard" link, but NOT the "Reportar" link
//         cy.get("nav").contains("Dashboard").should("be.visible")
//         cy.get("nav").contains("Reportar").should("not.exist")
//     } else {
//         // Citizens should see the "Reportar" link, but NOT the "Dashboard" link
//         cy.get("nav").contains("Reportar").should("be.visible")
//         cy.get("nav").contains("Dashboard").should("not.exist")
//     }
// });
Cypress.Commands.add(
  'login',
  (email, password, role: 'admin' | 'citizen' = 'citizen') => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();
    cy.intercept('GET', '**/auth/me').as('authCheck');
    cy.visit('/access'); // Go directly — no conditional button needed
    cy.get("[data-testid='login-email-input']").should('exist').type(email);
    cy.get("[data-testid='login-password-input']")
      .should('exist')
      .type(password);
    cy.get("[data-testid='login-submit-button']").should('exist').click();
    cy.wait('@authCheck').its('response.statusCode').should('eq', 200);
    cy.get("[data-testid='navbar-profile-button']").should('be.visible');
    if (role === 'admin') {
      cy.get('nav').contains('Dashboard').should('be.visible');
      cy.get('nav').contains('Reportar').should('not.exist');
    } else {
      cy.get('nav').contains('Reportar').should('be.visible');
      cy.get('nav').contains('Dashboard').should('not.exist');
    }
  }
);
