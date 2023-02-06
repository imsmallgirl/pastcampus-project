const express = require("express")
const fs = require("fs")
const cors = require("cors")

const data = JSON.parse(fs.readFileSync("data.json", "utf-8"))

const app = express();

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    const {author, message} = req.query
    
    res.json(data
        .filter(value => author ? value.author.includes(author) : true)
        .filter(value => message ? value.message.includes(message) : true))
})

app.get('/random', (req,res) => {

    const rand =  Math.floor(Math.random() * data.length)
     res.json(data[rand])
     
 })

app.get('/:id', (req,res) => {
    const {id} = req.params
    const num = parseInt(id)

    if(isNaN(id)){
        res.json({
            rs: false,
            msg: "id is not number!"
        })
        return;
    }else if(num >= data.length || num < 0){
        res.json({
            rs: false,
            msg: "num is not vaild"
        })
        return;
    }

    res.json(data[num])
})

app.post('/', (req, res) => {

    const {author, message} = req.body

    if(!(author && author.length > 0 && message && message.length > 0)){
        res.json({
            rs:false
        })
        return;
    }

    data.push({
        author: req.body.author,
        message : req.body.message
    })

    res.json({
        rs:true
    })
})
app.delete('/:id', (req, res) => {
    const {id} = req.params
    const num = parseInt(id)

    if(isNaN(id)){
        res.json({
            rs: false,
            msg: "id is not number!"
        })
        return;
    }else if(num >= data.length || num < 0){
        res.json({
            rs: false,
            msg: "num is not vaild"
        })
        return;
    }

    data.splice(num, 1)
    

    res.json({
        rs: true
    })
})

app.put('/:id', (req, res) => {
    const {author, message} = req.body

    if(!(author && author.length > 0 && message && message.length > 0)){
        res.json({
            rs:false,
            msg: "잘못된 데이터입니다."
        })
        return;
    }

    const {id} = req.params
    const num = parseInt(id)

    if(isNaN(id)){
        res.json({
            rs: false,
            msg: "id is not number!"
        })
        return;
    }else if(num >= data.length || num < 0){
        res.json({
            rs: false,
            msg: "num is not vaild"
        })
        return;
    }

    data[num] = {
        author: req.body.author,
        message : req.body.message
    }

    res.json({
        rs:true
    })
})

app.listen(4000, () => {
    console.log("start server!")
})

