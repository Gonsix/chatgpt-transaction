"use client"
import { Inter } from 'next/font/google'
import Form from '@/components/Form'
import type OpenAI from 'openai'
import { ThirdwebProvider } from "@thirdweb-dev/react";
import {Sepolia} from "@thirdweb-dev/chains";

const inter = Inter({ subsets: ['latin'] })

function getBaseURL() {
  if (typeof process.env.VERCEL_URL === 'string') {
    return `https://chatgpt.shivanshu.in`
  }
  return 'http://localhost:3000'
}

export default async function Home() {
  const modelsList = (await (
    await fetch(`https://chatgpt.shivanshu.in/api/models`)
  ).json()) as OpenAI.ModelsPage
  // console.log("MODELS")
  // console.log(modelsList)
  return (
    <ThirdwebProvider activeChain={Sepolia}>

      <main className={inter.className}>
        <Form modelsList={modelsList} />
      </main>
    </ThirdwebProvider>

  )
}
