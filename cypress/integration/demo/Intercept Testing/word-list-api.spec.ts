describe('Word List with interception', () => {
  const existingWords = [
    { id: 1, word: 'Ipsum1' },
    { id: 2, word: 'Ipsum2' },
    { id: 3, word: 'Lorem1' },
    { id: 4, word: 'Lorem2' },
  ];

  beforeEach(() => {
    cy.intercept('GET', 'http://127.0.0.1:5000/api/v1/words', {
      words: existingWords,
    });
    cy.visit('/cypress/word-list-api');
  });

  it('renders words correctly', () => {
    for (const [index, word] of existingWords.entries()) {
    cy.get(`[data-testid="word-list-item-${index + 1}"]`).should('have.text', word.word)
    };
  });

  it('addes new word correctly',()=>{
    cy.intercept('POST', 'http://127.0.0.1:5000/api/v1/words', {
      statusCode: 201,
      body: { word: { id: 5, word: 'Word#1' } },
    });

    cy.get('[data-testid="my-word-input"]').type('Word#1');
    cy.get('[data-testid="add-word-button"]').click();
    cy.get('[data-testid="word-list-item-5').should('have.text', 'Word#1');
  });

  it('allows to search keyword correctly',()=>{
    const keyword = 'Lorem';

    const matchedWords = existingWords.filter(({word})=>
      word.includes(keyword)
    );

    cy.intercept({pathname: '/api/v1/words', 
      query: {term: keyword}
      },
      {words: matchedWords}
    );
    cy.get('[data-testid="search-input"').type(keyword)
    cy.get('[data-testid="word-list-item-3"]').should('have.text','Lorem1')
    cy.get('[data-testid="word-list-item-4"]').should('have.text','Lorem2')
  });

  it('updates the word correctly',()=>{
    cy.intercept('PATCH','http://127.0.0.1:5000/api/v1/words/1',{
      statusCode: 201,
      body: {word: { id :1, word: 'Edit Word' } },
    });

    cy.get('[data-testid="word-list-item-1"]').find('[data-testid="edit-word-button"]').click()
    cy.get('[data-testid="word-list-item-1"]').clear().type('Edit Word')
    cy.get('[data-testid="word-list-item-1"]').find('[data-testid="edit-word-button"]').click()
    cy.get('[data-testid="word-list-item-1"]').should('have.text','Edit Word')
  });

  it('deletes the word correctly',()=>{
    cy.intercept('DELETE', 'http://127.0.0.1:5000/api/v1/words/1', {
      statusCode: 204,
    });
    cy.get('[data-testid="word-list-item-1"]')
      .find('[data-testid="delete-word-button"]')
      .click();
    cy.get('[data-testid="word-list"]').should('not.contain', existingWords[0].word);
  });
});