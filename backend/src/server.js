require("dotenv").config()
const app = require("./app.js")
const connectToDB = require("./config/database.js")
const invokeGeminiAi = require("./services/ai.service.js")

connectToDB()

app.listen(3000, () => {
    console.log("Server is running on port 3000!");
    
})