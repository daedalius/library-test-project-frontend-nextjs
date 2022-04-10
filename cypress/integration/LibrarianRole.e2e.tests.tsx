/// <reference types="cypress" />

describe('For user with librarian role the application', () => {
  beforeEach(() => {
    cy.task('db:seed').then((sessionIdValue) => {
      cy.setCookie('session-id', sessionIdValue as string);
    });
  });

  it('allows to navigate to librarian menu', () => {
    cy.visit('/');
    cy.contains('Librarian menu').click();
    cy.url().should('include', '/librarian');
  });

  describe('in authors section', () => {
    it('allows to search for authors', () => {
      cy.visit('/librarian/authors');
      cy.get('input[placeholder="Author name to search"]').type('Shakespeare');
      cy.get('select').contains('William Shakespeare');
    });

    it('allows to add new author', () => {
      // arrange
      cy.visit('/librarian/authors');
      cy.get('button').contains('Add an author').click();
      // act
      cy.get('input[placeholder="Author name"]').type('NewAuthor{enter}');
      // assert
      cy.get('input[placeholder="Author name to search"]').type('NewAuthor');
      cy.get('select option').contains('NewAuthor');
    });

    it('allows to edit an author', () => {
      cy.visit('/librarian/authors');
      cy.get('input[placeholder="Author name to search"]').type('Shakespeare');
      cy.get('[data-element="authors-found"]').select('William Shakespeare');
      cy.contains('Edit an author').click();
      // act
      cy.get('input[placeholder="Author name"]').clear().type('William Shakespeare Edited{enter}');
      // assert
      cy.get('input[placeholder="Author name to search"]').clear().type('Shakespeare Edited');
      cy.get('option').contains('William Shakespeare Edited');
    });

    it('not allows to remove an author who mentioned as book author', () => {
      cy.visit('/librarian/authors');
      cy.get('input[placeholder="Author name to search"]').type('Shakespeare');
      cy.get('[data-element="authors-found"]').select('William Shakespeare');

      cy.on('window:alert', (text) => {
        // assert
        expect(text).to.contains('Unable to remove William Shakespeare');
      });
      // act
      cy.get('button').contains('Remove an author').click();
    });

    it('allows to remove an author who doens`t mentioned as book author', () => {
      // arrange
      cy.visit('/librarian/authors');
      cy.get('button').contains('Add an author').click();
      cy.get('input[placeholder="Author name"]').type('NewAuthor{enter}');
      cy.get('input[placeholder="Author name to search"]').type('NewAuthor');
      cy.get('[data-element="authors-found"]').select('NewAuthor');

      // act
      cy.get('button').contains('Remove an author').click();

      // assert
      cy.get('[data-element="authors-found"]').contains('NewAuthor').should('not.exist');
    });
  });

  describe('in books sections', () => {
    it('allows to search for book', () => {
      cy.visit('/librarian/books');
      cy.get('input[placeholder="Book title or description to search"]').type('war');
      cy.get('select').contains('War and peace');
    });

    it('allows to add a new book', () => {
      cy.visit('/librarian/books');
      cy.get('button').contains('Add a book').click();

      // act
      cy.get('#title').type('New Book Title');
      cy.get('#description').type('New Book Description');
      cy.get('#coverUrl').type('https://toppng.com/uploads/preview/children-books-png-11552333702qiq1ay67zb.png');
      cy.get('#authors').select('William Shakespeare');
      cy.get('input[type=submit]').contains('Submit').click();

      // assert
      cy.get('input[placeholder="Book title or description to search"]').type('New Book');
      cy.get('select').contains('New Book Title');
    });

    it('allows to edit a book', () => {
      cy.visit('/librarian/books');
      cy.get('input[placeholder="Book title or description to search"]').type('war');
      cy.get('select').select('War and peace');

      // act
      cy.get('button').contains('Edit a book').click();
      cy.get('#title').clear().type('War and Peace. Vol. 6');
      cy.get('#description').clear().type('War and Peace Description');
      cy.get('input[type=submit]').contains('Submit').click();

      // assert
      cy.get('input[placeholder="Book title or description to search"]').clear().type('Vol. 6');
      cy.get('select').contains('War and Peace. Vol. 6');
    });

    it('allows to delete a book', () => {
      cy.visit('/librarian/books');
      cy.get('button').contains('Add a book').click();
      cy.get('#title').type('New Book Title');
      cy.get('#description').type('New Book Description');
      cy.get('#coverUrl').type('https://toppng.com/uploads/preview/children-books-png-11552333702qiq1ay67zb.png');
      cy.get('#authors').select('William Shakespeare');
      cy.get('input[type=submit]').contains('Submit').click();
      cy.get('input[placeholder="Book title or description to search"]').type('New Book');
      cy.get('select').contains('New Book Title');

      // act
      cy.get('select').select('New Book Title');
      cy.get('button').contains('Remove a book').click();

      // assert
      cy.get('select').contains('New Book Title').should('not.exist');
    });

    it('allows to add book copy', () => {
      cy.visit('/librarian/books');
      cy.get('input[placeholder="Book title or description to search"]').type('war');
      cy.get('select').select('War and peace');
      cy.get('button').contains('Edit copies').click()

      // assert
      cy.contains('No registered copies for that book')

      // act
      cy.get('input[value="Register new copy"]').click()

      // assert
      cy.get('select.book-copies-editor__list option').should('exist')
    })

    it('allows to remove book copy', () => {
      cy.visit('/librarian/books');
      cy.get('input[placeholder="Book title or description to search"]').type('war');
      cy.get('select').select('War and peace');
      cy.get('button').contains('Edit copies').click()
      cy.get('input[value="Register new copy"]').click()
      cy.get('select.book-copies-editor__list').select(0)

      // act
      cy.get('input[value="Remove a book copy"]').click()

      // assert
      cy.contains('No registered copies for that book')
    })
  });
});
