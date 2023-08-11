import puppeteer, { Browser, Page } from 'puppeteer'
import * as fs from 'fs'

const url: string = 'https://www.traversymedia.com/'
const url2: string = 'https://books.toscrape.com'

const run = async () => {
  const browser: Browser = await puppeteer.launch({ headless: 'new' })
  const page: Page = await browser.newPage()
  await page.goto(url2)

  const bookData = await page.evaluate((url) => {
    const bookPods = Array.from(document.querySelectorAll('.product_pod'))

    const convertPrice = (price: string) => {
      return parseFloat(price.replace('£', ''))
    }

    const convertRating = (rating: string) => {
      let numberRating: number
      switch (rating) {
        case 'One':
          numberRating = 1
          break
        case 'Two':
          numberRating = 2
          break
        case 'Three':
          numberRating = 3
          break
        case 'Four':
          numberRating = 4
          break
        case 'Five':
          numberRating = 5
          break
        default:
          numberRating = 0
      }
      return numberRating
    }

    const data = bookPods.map((book: any) => ({
      title: book.querySelector('h3 a').getAttribute('title'),
      price: convertPrice(book.querySelector('.price_color').innerText),
      imageSrc: url + book.querySelector('img').getAttribute('src'),
      rating: convertRating(book.querySelector('.star-rating').classList[1]),
    }))
    return data
  }, url)

  await browser.close()
  fs.writeFile('data/books.json', JSON.stringify(bookData), (err: any) => {
    if(err)
      console.log(err)
    else
      console.log('Data saved successfully')
  } )
}

run()
