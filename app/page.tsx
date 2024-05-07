'use client';
import Image from "next/image";
import React from 'react';
import { OpenAI } from "openai";
import { useState } from "react";
import { Button } from "flowbite-react";
import { Label, Textarea, Card, Spinner, Modal } from "flowbite-react"

const openai = new OpenAI();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

openai.apiKey = OPENAI_API_KEY;

let response: string = ''
const defaultBrandGuidelines = `
Clear

We show respect to our audience by writing as clearly and concisely as possible. We avoid jargon and flowery language. For example, we will never use a word like “utilize” and will always use the simpler “use”. We avoid long sentences. We avoid the passive voice.
We assume that words mean what they mean in the common vernacular vs what we wish the words mean or what pedants might declare the words to mean. For example if LLMs (Large Language Models) come to refer to models that also process videos and images we will use the term LLMs in that way.
We are not afraid to use bullet points instead of paragraphs.

Friendly
We want our audience to feel like we are human and approachable. We use informal grammar, slang and emojis when it improves the clarity of the communication.
We never want our audience to feel confused or stupid. We also recognize that a large percent of our readers are not native English speakers. We err on the side of writing out acronyms and explaining or avoiding technical terms that our audience might not know.
Concrete

Our audience is builders. We avoid lazy business phrases like “delivering value” and use more specific language.
`






export default function Home() {
  const [response, setResponse] = useState('')
  const [inProgress, setInProgress] = useState(false)
  const [openModal, setOpenModal] = useState(false);
  const [brandGuidelines, setBrandGuidelines] = useState(defaultBrandGuidelines);


  async function openaiRewrite(text: string) {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: `Rewrite the text input to adhere to our brand guidlines, which are as follows ${brandGuidelines}` }, { role: "user", content: text }],
      model: "gpt-3.5-turbo",
    });
    setInProgress(false)
    setResponse(completion.choices[0].message.content || "");

  }

  function handleClick() {
    const text = document.getElementById('message') as HTMLTextAreaElement;
    setInProgress(true)
    openaiRewrite(text.value)
  }

  function resetBrandGuidelines() {
    const text = document.getElementById('brandGuidelines') as HTMLTextAreaElement;
    setBrandGuidelines(text.value)
    setOpenModal(false)
  }


  return (
    <>
      <div className="flex flex-col items-center h-screen p-24">

        <div className="flex grow h-3/4 p-8 w-3/4">
          <Card className="bg-white grow m-4 p-2 bg-white border border-gray-200 rounded-lg shadow">
            <h5 className="text-2xl tracking-tight text-gray-900 dark:text-white">Your Text</h5>
            <Textarea className="flex-1 h-full" id="message" name="message" ></Textarea>

          </Card>
          <Card className="bg-white grow m-4 p-2 bg-white border border-gray-200 rounded-lg shadow">
            <h5 className="text-2xl tracking-tight text-gray-900 dark:text-white">Rewritten Text</h5>

            <Textarea className="flex-1 h-full" name="result" id='result' readOnly value={response}>
            </Textarea>



          </Card>

        </div >
        <div className="flex flex-row">
          <Button onClick={handleClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            Rewrite
            {inProgress ? <Spinner /> : ""}

          </Button>
          {/*        
            <Button onClick={() => setOpenModal(true)}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            Edit Guidelines

          </Button>  */}
        </div>
      </div>
      <Modal show={openModal} size="lg" popup position='center'>
        <Modal.Header>Text Guidelines</Modal.Header>
        <Modal.Body>
          <div>
            <Textarea className="flex-1 h-full" id="brandGuidelines" defaultValue={brandGuidelines}></Textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => resetBrandGuidelines}>Change</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>



  );
}
