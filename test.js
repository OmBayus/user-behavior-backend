const express = require("express")

const app = express()


app.get("/",(req,res)=>{
    res.send("<h1>hello world</h1>")
})

app.listen(3000)