const express = require('express')
const fs = require('fs')
const app = express()
const getTribun = require('./lib/tribun.js')
const caklontong = require('./lib/tts.js')
require("dotenv").config()
app.get('/', (req, res) => {
    res.send('Hello!')
})

app.get('/berita', (req, res) => {
    if (req.query.k) {
        getTribun(req.query.k)
            .then(resp => {
                res.send(resp)
            })
            .catch(err => {
                if (err == "404") {
                    res.sendStatus(404)
                } else {
                    res.status(500)
                    res.send('terjadi kesalahan')
                    console.log(err)
                }
            })
    } else {
        getTribun()
            .then(resp => res.send(resp))
            .catch(err => {
                if (err == "404") {
                    res.sendStatus(404)
                } else {
                    res.status(500)
                    res.send('terjadi kesalahan')
                    console.log(err)
                }
            })
    }
})

app.get('/berita/:id', (req, res) => {
    if (!req.query.k) return res.sendStatus(404)
    getTribun(req.query.k)
        .then(resp => {
            const findd = resp.find(x => x.id == req.params.id)
            if(findd == undefined) return res.sendStatus(404)
            res.send(findd)
        })
        .catch(err => {
            if (err == "404") {
                res.sendStatus(404)
            } else {
                res.status(500)
                res.send('terjadi kesalahan')
                console.log(err)
            }
        })
})

app.get('/caklontong', async (req,res) => {
    const random = await caklontong.getRandom()
    res.send(random)   
})

app.get('/caklontong/:id', async (req,res) => {
    try{
        const data = await caklontong.getByIndex(req.params.id)
        res.send(data)
    } catch(err) {
        res.sendStatus(404)
    }
})

app.listen(process.env.PORT, () => console.log('Server dijalankan di port ' + process.env.PORT))
