const PORT = process.env.PORT || 8000
const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')

const app = express()

const publications = [
    {
        name: 'economictimes',
        address: 'https://auto.economictimes.indiatimes.com/latest-news',
        base: ''
    },
    {
        name: 'greencarreports',
        address: 'https://www.greencarreports.com/news/electric-cars',
        base: 'https://www.greencarreports.com'
    },
    {
        name: 'businessstandard',
        address: 'https://www.business-standard.com/topic/electric-vehicles',
        base: 'https://www.business-standard.com'
    },
    {
        name: 'mint',
        address: 'https://www.livemint.com/Search/Link/Keyword/Electric-Vehicles',
        base: 'https://www.livemint.com'
    }
]


const articles = []

publications.forEach((pub) => {
    axios.get(pub.address)
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("electric")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: pub.base + url,
                    source: pub.name
                })
            })
        }).catch((err) => console.log(err))
})





app.get('/', (req, res) => {
    res.json("HOMEPAGE")
})

app.get('/evupdates', (req, res) => {
    res.json(articles)
})

app.get('/evupdates/:pubId', (req, res) => {
    const pubName = req.params.pubId
    const pubAddress = publications.filter(pub => pub.name == pubName)[0].address
    const pubBase = publications.filter(pub => pub.name == pubName)[0].base

    axios.get(pubAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificarticle = []

            $('a:contains("electric")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                specificarticle.push({
                    title,
                    url: pubBase + url,
                    source: pubName
                })
            })
            res.json(specificarticle)
        }).catch((err) => console.log(err))


})




app.listen(PORT, (req, res) => {
    console.log(`server is running on PORT ${PORT}`)
})

