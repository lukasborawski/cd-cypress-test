Cypress.Commands.add('filtering',(filterType, inputPlaceholder, filterPhrase) => {
    filterType.get('.multiselect__placeholder').first().click({ force: true })
    cy.wait(500)
    cy.get(`input[placeholder="${inputPlaceholder}"]`).type(filterPhrase, { force: true })
    filterType.get('.multiselect__element').contains(filterPhrase).click({ force: true })
})
