/// <reference types="cypress" />

describe("Application auth", () => {
  beforeEach(() => {
    cy.task("db:seed");
  });

  it("allows to sign in and redirects to books page", () => {
    cy.visit("/");

    cy.get("#login").type("admin");
    cy.get("#password").type("password{enter}");

    cy.url().should("include", "/books");
  });

  it("allows to sign out and redirects to login page", () => {
    cy.visit("/");

    cy.get("#login").type("admin");
    cy.get("#password").type("password{enter}");

    cy.contains("Sign Out").click();

    cy.url().should("include", "/sign-in");
  });

  it("allows to sign up and redirects to books page", () => {
    cy.visit("/sign-up");
    cy.contains("Sign Up");

    cy.get("#login").type("NewUserLogin");
    cy.get("#password").type("NewUserPassword{enter}");

    cy.url().should("include", "/books");
  });

  it("doesn`t allow to sign up user with same login", () => {
    // arrange
    cy.visit("/sign-up");

    cy.get("#login").type("NewUserLogin");
    cy.get("#password").type("NewUserPassword{enter}");

    cy.contains("Sign Out").click();

    cy.on("window:alert", (text) => {
      // assert
      expect(text).to.contains(
        "Unable to register user with that login/password pair"
      );
    });

    // act
    cy.visit("/sign-up");
    cy.get("#login").type("NewUserLogin");
    cy.get("#password").type("NewUserPassword{enter}");
  });
});
