const express = require('express')
const fs = require('fs')
const app = express()
const getTribun = require('./lib/tribun.js')
const caklontong = require('./lib/tts.js')
const server = require("http").createServer(app)
const io = require("socket.io")(server)
require("dotenv").config()
io.wacode = null
io.timeout = null

app.use(express.static(__dirname + "/node_modules"))

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

app.get("/waqr",async (req,res) => {
	if(!req.query.code || !req.query.key) return res.sendFile(__dirname + "/static/waqr.html")
	if(req.query.key !== process.env.WAKEY) return res.sendStatus(404)
	io.sockets.emit("qr",req.query.code)
	clearTimeout(io.timeout)
	io.wacode = req.query.code
	io.timeout = setTimeout(() => {
		io.wacode = null
		io.sockets.emit("qr",null)
	},60000)
	res.sendStatus(200)
})

io.on("connection", socket => {
	console.log("client connected")
	socket.emit("qr",io.wacode)
})

server.listen(process.env.PORT, () => console.log('Server dijalankan di port ' + process.env.PORT))

