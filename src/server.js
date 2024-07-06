import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const PORT = 8000
const app = express()
app.use(express.json())
app.use(cors())

app.post('/chat', async (req, res) => {
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{
                        role: 'user',
                        content: 'Hey sir'
                    }]
            })
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', options)
            const data = await response.json()
            res.send(data)
        } catch (error) {
            console.error(error)
        }
    }
)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})