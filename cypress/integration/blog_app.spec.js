describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const userA = {
      name: 'tim coorey',
      username: 'tim',
      password: '123'
    }
    const userB = {
      name: 'max ray',
      username: 'max',
      password: '123'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', userA)
    cy.request('POST', 'http://localhost:3001/api/users/', userB)
    cy.visit('http://localhost:3000')
  })
  it('Login form is shown', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Login')
    cy.contains('username')
    cy.contains('password')
  })
  describe('Login', function () {
    it('succeeds with correct credentails', function () {
      cy.contains('login').click()
      cy.get('#username').type('tim')
      cy.get('#password').type('123')
      cy.get('#login-button').click()

      cy.contains('tim coorey logged in').parent().find('button')
        .should('contain', 'log out')
    })
    it('fails with wrong credentails', function () {
      cy.contains('login').click()
      cy.get('#username').type('henry')
      cy.get('#password').type('4563')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })
  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'tim', password: '123' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#txtTitle').type('HTML is easy')
      cy.get('#txtAuthor').type('Dan Abromov')
      cy.get('#txtUrl').type('www.wsscjools.com')
      cy.contains('create').click()

      cy.contains('HTML is easy')
    })
  })
  describe('after a blog is created', function() {
    beforeEach(function() {
      cy.login({ username: 'tim', password: '123' })
      cy.createBlog({
        title: 'Javascript for everyone',
        author: 'Ron',
        url:'www.esfyd.lk'
      })
    })

    it('view the blog', function() {
      cy.contains('Javascript for everyone').contains('view').click()
      cy.contains('Ron')
    })

    it('like a blog', function() {
      cy.contains('Javascript for everyone').contains('view').click()
      cy.contains('like').click()
      cy.contains('1')
    })

    it('can be removed by authorized user',function() {
      cy.contains('Javascript for everyone').contains('view').click()
      cy.contains('remove').click()
    })
  })
  describe('cannot delete blog if not authorised', function() {
    beforeEach(function() {
      cy.login({ username: 'max', password: '123' })
      cy.createBlog({
        title: 'Dev Tools you must know',
        author: 'Terry',
        url:'www.esfyd.lk'
      })
    })
    it('deleting a blog', function() {
      cy.contains('log out').click()
      cy.login({ username: 'tim', password: '123' })
      cy.contains('tim coorey logged in')
      cy.contains('Dev Tools you must know').contains('view').click()
      cy.get('html').should('not.contain', 'remove')
    })
  })
  describe('blogs are ordered', function() {
    beforeEach(function() {
      cy.login({ username: 'max', password: '123' })
      cy.createBlog({
        title: 'Dev Tools you must know',
        author: 'Terry',
        url:'www.esfyd.lk',
        likes:'12'
      })
      cy.createBlog({
        title: 'Typescript is funny',
        author: 'jane',
        url:'www.edsdfs.lk',
        likes:'23'
      })

    })
    it('blogs with highest likes comes first', function (){
      cy.get('.blog').then( blog => {
        cy.wrap(blog[0]).should('contain', 'Typescript is funny-jane')
        cy.wrap(blog[1]).should('contain', 'Dev Tools you must know-Terry')
      })

    })
  })
})