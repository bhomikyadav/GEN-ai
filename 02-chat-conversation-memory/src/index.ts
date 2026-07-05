import { OpenAI } from 'openai';

import { configDotenv } from 'dotenv';

configDotenv();

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
});

type ContextType = {
    role: 'user' | 'assistant' | 'system',
    content: string
}[];

let context: ContextType = [
    {
        role: 'system',
        content: 'pretend to be as help assistant',
    },
];

async function callAI() {
    const res = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: context
    })

    console.log(`Role: ${res.choices[0]?.message.role} => Reply : ${res.choices[0]?.message.content}`);

    context.push({
        role: 'assistant',
        content: res.choices[0]?.message.content as string
    })



}

async function run() {
    const input = require('prompt-sync')({ sigint: true });


    while (true) {

        const msg = input("Enter Message") as string;

        if (msg === 'exit') {
            console.log('Exiting ...');
            break;
        }

        context.push({
            role: 'user',
            content: msg
        })


        await callAI();

    }

}

run();