const BASE_URL = 'https://sebts-staging-events.coursedog.com'

describe('Events', () => {

    let card
    let searchResults
    let multiSelectType
    let multiSelectOrganization

    beforeEach(() => {
        cy.visit(BASE_URL)
        card = cy.get('.container').get('h1').next('.card')
        searchResults = cy.get('.container section p').eq(0)
        multiSelectType = cy.get('.container .multiselect').eq(0)
        multiSelectOrganization = cy.get('.container .multiselect').eq(0)
    })

    it('As a user, I can see the events page', () {
        cy.get('nav').contains('SEBTS Events')
    })

    it('As a user, I want to see the list of featured events', () => {
        cy.get('h1').contains("Today’s events:")
        cy.wait(500)
        card.contains('Organized by')
    })

    it('As a user, I want to be able to see search results based on search query', () => {
        ['Car', 'Board'].map((phrase, index) => {
            const input = cy.get('input[placeholder="Type to search for events"]')
            input.type(phrase, { force: true }).then($input => {
                cy.url().should('include', `search?page=1&q=${phrase}`)
                if (index === 0) cy.wrap($input).clear()
            })
            cy.wait(2000)
            card.contains(phrase)
            searchResults.should('not.contain', 'Showing 0 – 0 of 0 meetings')
        })
    })

    it('As a user, I can not see the search results for given search phrase', () => {
        cy.get('input[placeholder="Type to search for events"]').type('blablabla')
        cy.wait(2000)
        card.should('not.be.visible')
        cy.wait(500)
        searchResults.contains('Showing 0 – 0 of 0 meetings')
    })

    function filtering (filterType, inputPlaceholder, filterPhrase) {
        filterType.get('.multiselect__placeholder').first().click({force: true})
        cy.wait(500)
        cy.get(`input[placeholder="${inputPlaceholder}"]`).type(filterPhrase, {force: true})
        filterType.get('.multiselect__element').contains(filterPhrase).click({force: true})
    }

    it('As a use, I can see the search results based on filtered event type', () => {
        /* fn() [filtering]: cy custom command */
        filtering(multiSelectType, 'Select event type', 'Community Event')
        card.get('label').contains('Event Type').next('div').get('a').contains('Community Event')
        /*
        * Story: As a use, I can see the search results based on filtered event type (Community Event)
        * TODO: [bug] fix the search results after selecting event type
        * Description: Event\s with type 'Community Event' exists, but they were not found in the search results.
        * Reproduction steps:
            - visit events page (https://sebts-staging-events.coursedog.com)
            - select event type - Community Event
        */
    })

    it('As a use, I can see the search results based on filtered organization', () => {
        /* fn() [filtering]: cy custom command */
        filtering(multiSelectOrganization, 'Select organization', "President's Office")
        card.get('label').contains('Organized by').next('div').get('a').contains("President's Office")
    })

    it('As a user, I can see events prepend for the specific date from the calendar', () => {
        const getMonthName = new Date().toLocaleString('en-EN', { month: 'long' })
        cy.get('.vc-day-content').contains('2').click({ force: true})
        cy.wait(2000)
        cy.get('h1').should('contain', `${getMonthName} 2`)
        card.get('h2').eq(0).next('p').should('contain', `${getMonthName.substring(0, 3)} 2`)
    })

    it('As a user, I want to be able to subscribe to the RSS feed for a selected event type', () => {
        cy.get('a[title="Subscribe to the RSS feed"]').eq(1).click({ force: true })
        /*
        * The RSS link opens in the new browser tab, so that:
        * "Cypress does not and may never have multi-tab support for various reasons."
        */
    })

    it('As a user, I want to be able to add a selected event to my calendar', () => {
        card.get('h2').eq(1).click({ force: true })
        cy.wait(1000)
        cy.url().should('include', `events`)
        cy.wait(1000)
        cy.get('button').contains('Add to calendar').click({ force: true })
    })

    it('As a user, I can see event all details like: name, description, date and time, organiser info, contacts list, event type', () => {
        card.get('h2').eq(1).click({ force: true })
        cy.wait(2000)
        cy.get('h2').should('be.visible')
        const infoLinkSelector = (name) => cy.get('label').contains(name).next('div').get('a')
        infoLinkSelector('Event Type').should('be.visible')
        infoLinkSelector('Contacts').should('be.visible')
        infoLinkSelector('Organized by').should('be.visible')
        /*
        * Story: As a user, I can see event all details like: name, description, date and time, organiser info, contacts list, event type
        * TODO: [bug/improvement/enhancement] fix/correct the HTML structure
        * Description:
            The HTML structure is too generic, it's hard to check event name, place and date.
            Links to the additional info (Event type, Contacts ...) are notated in the different HTML markups (divs/spans),
            therefore hovers are different, also testing those is difficult.
         */
    })
})


