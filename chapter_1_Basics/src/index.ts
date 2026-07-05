import { OpenAI } from 'openai';
import { configDotenv } from 'dotenv'

configDotenv();


const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY
})

async function run() {
    const res = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{
            role: 'user', content: 'Hello My name is Bhomik'
        }]
    })

    console.log('Res : ', res.choices[0]?.message.content);

}


run()