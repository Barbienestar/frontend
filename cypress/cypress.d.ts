declare global {
  namespace Cypress {
    interface Chainable {
      login(
        email: string,
        password: string,
        role?: 'admin' | 'citizen' | 'health'
      ): Chainable<void>;
    }
  }
}

export {};
