import { createAuth } from 'models/auth'
import { mockSignup } from 'api/auth'

describe('SignUp UI',()=>{
  it('handles resigter correcly',()=>{
    const auth = createAuth();
    mockSignup(auth.email).mocked.as('signup');

    cy.visit('/articles')
    cy.get('[data-testid="auth-menu-login-button"]').click();
    cy.location('pathname').should('eq','/auth/sign-in');
    cy.get('[data-testid="auth-form-alt-button"]').click();
    cy.location('pathname').should('eq','/auth/sign-up');
    cy.get('[data-testid="auth-form-email"]').type(auth.email);
    cy.get('[data-testid="auth-form-password"]').type(auth.password);
    cy.get('[data-testid="auth-form-submit-button"]').click();
    cy.wait('@signup').its('request.body').should('deep.equal', auth);
    cy.get('[data-testid="flash-message"]').should('have.text', 'Your account has been created.');
  });
});