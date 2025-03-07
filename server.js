const express = require('express')
const cors = require('cors')
const db = require('./db')
const app = express()

const tripRouter = require('./routes/trip')
const expensesRouter = require('./routes/expenses')
const consultantRouter = require('./routes/consultant')
const requestRouter = require('./routes/request')

app.use(cors())
app.use(express.json())

app.use('/trip',tripRouter)
app.use('/expenses',expensesRouter)
app.use('/consultant',consultantRouter)
app.use('/request',requestRouter)

app.use('/test',(req,res)=>{
    res.send("tested")
})

app.listen(7000,()=>{
    console.log("The port succesfully running on 7000")
})
