const createNewWord = (word:string)=>{
  cy.get('[data-testid="my-word-input"]').type(word)
  cy.get('[data-testid="add-word-button"]').click()
};

const existingWord_ = 'My Word';

describe('Word List',()=>{
  beforeEach(()=>{
    cy.request('DELETE','http://127.0.0.1:5000/api/v1/words/reset')
    cy.visit('/cypress/word-list-api');
    createNewWord(existingWord_);
  });


  it('renders words correctly',()=>{
    cy.get('[data-testid="word-list-item-1"]').should('have.text', existingWord_)
  });

  it('addes new word correctly',()=>{
    createNewWord('New Word')
    cy.get('[data-testid="word-list-item-1"]').should('have.text', existingWord_);
    cy.get('[data-testid="word-list-item-2"]').should('have.text', 'New Word');
  });

  it('updates the word correctly',()=>{
    cy.get('[data-testid="word-list-item-1"]').find('[data-testid="edit-word-button"]').click();
    cy.get('[data-testid="word-list-item-1"]').clear().type('Edit Word');
    cy.get('[data-testid="edit-word-button"]').click();
    cy.get('[data-testid="word-list-item-1"]').should('have.text','Edit Word');
  });

  it('deletes the word correctly',()=>{
    cy.get('[data-testid="word-list-item-1"]').find('[data-testid="delete-word-button"]').click();
    cy.get('[data-testid="word-list"]').should('not.contain', existingWord_);
  });
});