import * as faker from 'faker';
const { _ } = Cypress

describe('Post Form', ()=>{
  beforeEach(()=>{
    cy.visit('/cypress/post-form')
  });

  it('handles form input correctly', ()=>{
    const newPost = {
      title: faker.lorem.sentence(), 
      category: faker.helpers.randomize(['java', 'python', 'ruby']), 
      status: faker.helpers.randomize(['drafted', 'published']), 
      content: faker.lorem.paragraph()
  };

    cy.get('[data-testid="post-form-title"]').type(newPost.title);
    cy.get('[data-testid="post-form-category"]').select(newPost.category);
    cy.get(`[data-testid="post-form-${newPost.status}-status"]`).check();
    cy.get('[data-testid="post-form-content"]').type(newPost.content);
    cy.get('[data-testid="post-form-submit-button"]').click();
  });

  it.only('handles validation correctly', ()=>{
    cy.get('[data-testid="post-form-title"]').type('title').clear().blur();
    cy.get('[data-testid="post-form-content"]').type('content').clear().blur();
    cy.get('[data-testid="post-form-title-helper"]').should('have.text','title is a required field');
    cy.get('[data-testid="post-form-content-helper"]').should('have.text','content is a required field');
    cy.get('[data-testid="post-form-submit-button"]').should('be.disabled');
  });
});