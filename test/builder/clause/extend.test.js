const { sq, query } = require('../tape')

describe('extend', () => {
  describe('basic', () => {
    query({
      name: 'frm',
      query: sq.extend(sq.from`book`),
      text: 'select * from book'
    })
    query({
      name: 'frm - 2 calls',
      query: sq.extend(sq.from`book`, sq.from`author`),
      text: 'select * from book, author'
    })
    query({
      name: '2 calls',
      query: sq.extend(sq.from`book`, sq.where`year > 2000`, sq.return`title`),
      text: 'select title from book where (year > 2000)'
    })
    query({
      name: '3 calls',
      query: sq.extend(
        sq.from`book`,
        sq.where`year > 2000`,
        sq.where`genre = 'fantasy'`,
        sq.return`title`
      ),
      text: `select title from book where (year > 2000) and (genre = 'fantasy')`
    })
    query({
      name: 'chained call',
      query: sq.extend(sq.from`book`.where`year > 2000`, sq.return`title`),
      text: 'select title from book where (year > 2000)'
    })
    query({
      name: 'chained .extend',
      query: sq.extend(sq.from`book`.where`year > 2000`).return`title`,
      text: 'select title from book where (year > 2000)'
    })
    query({
      name: 'args',
      query: sq.extend(
        sq.from`book`,
        sq.where`year > ${2000}`,
        sq.where`genre = ${'fantasy'} or genre = ${'history'}`,
        sq.return`title`
      ),
      text:
        'select title from book where (year > $1) and (genre = $2 or genre = $3)',
      args: [2000, 'fantasy', 'history']
    })
    query({
      name: 'chained args',
      query: sq.extend(
        sq.from`book`.where`year > ${2000}`,
        sq.where`genre = ${'fantasy'} or genre = ${'history'}`,
        sq.return`title`
      ),
      text:
        'select title from book where (year > $1) and (genre = $2 or genre = $3)',
      args: [2000, 'fantasy', 'history']
    })
    query({
      name: 'chained args',
      query: sq.extend(sq.from`book`.where`year > ${2000}`, sq.return`title`)
        .where`genre = ${'fantasy'} or genre = ${'history'}`,
      text:
        'select title from book where (year > $1) and (genre = $2 or genre = $3)',
      args: [2000, 'fantasy', 'history']
    })
  })
  describe('express', () => {
    query({
      name: 'frm',
      query: sq`book`({ genre: 'fantasy' }).extend(
        sq`author`({ name: 'Jordan' })
      ).where`book.author_id = author.id``title`,
      text:
        'select title from book, author where (genre = $1) and (name = $2) and (book.author_id = author.id)',
      args: ['fantasy', 'Jordan']
    })
  })
})
