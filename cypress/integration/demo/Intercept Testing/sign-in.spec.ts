import { mockSignin } from "api/auth"
import { mockProflie } from "api/auth"
import { createUser } from 'models/auth'
import { mockInvalidSignin } from 'api/auth'
import { createAuth } from 'models/auth'

describe('Signin And Logout UI',()=>{
  it('handles login and logout correctly',()=>{
    const auth = createAuth();
    const profile = createUser(auth.email);
    const { response: signinResponse, mocked: mockedSignin } = mockSignin();
    
    mockedSignin.as('signin');
    mockProflie(profile).mocked.as('profile');
    cy.visit('/articles');
    cy.get('[data-testid="auth-menu-login-button"]').click();
    cy.location('pathname').should('eq','/auth/sign-in');
    cy.get('[data-testid="auth-form-email"]').type(auth.email);
    cy.get('[data-testid="auth-form-password"]').type(auth.password);
    cy.get('[data-testid="auth-form-submit-button"]').click();
    cy.wait('@signin').its('request.body').should('deep.equal', auth)
      cy.should(()=>{
      expect(localStorage.getItem('accessToken')).to.eq(signinResponse.token)
      })
    cy.wait('@profile').its('request.headers').should('include', {authorization: `Bearer ${signinResponse.token}`})
    cy.get('[data-testid="flash-message"]').should('have.text', 'Welcome back!');

    cy.get('[data-testid="auth-profile-name"]').click();
    cy.get('[data-testid="auth-menu-logout"]').click();  
    cy.should(() => {
      expect(localStorage.getItem('accessToken')).to.be.null;
    });
    cy.get('[data-testid="flash-message"]').should('have.text', 'Bye!');
    cy.get('[data-testid="auth-menu-login-button"]').should('be.visible');
  });
   
  it('handles invalid credentials correctly', () => {
    const auth = createAuth();
  
    mockInvalidSignin();
    cy.visit('/auth/sign-in');
    cy.get('[data-testid="auth-form-email"]').type(auth.email);
    cy.get('[data-testid="auth-form-password"]').type('invalid-password');
    cy.get('[data-testid="auth-form-submit-button"]').click();
    cy.get('[data-testid="flash-message"]').should(
      'have.text',
      'incorrect Username or Password'
    );
  });
});




