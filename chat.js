/** @format */

import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import HttpsProxyAgent from "https-proxy-agent";
import dotenv from "dotenv";
dotenv.config();
const agent = new HttpsProxyAgent.HttpsProxyAgent(process.env.http_proxy);

const model = new OpenAI(
  {
    temperature: 0,
  },
  { baseOptions: { httpsAgent: agent } }
);

const pineconeClient = new PineconeClient();
await pineconeClient.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIROMENT,
});
const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX);
const pineconeStore = await PineconeStore.fromExistingIndex(new OpenAIEmbeddings(undefined, { baseOptions: { httpsAgent: agent } }), {
  pineconeIndex,
  textKey: "text",
  namespace: "vue3-chatbot",
});

const chains = ConversationalRetrievalQAChain.fromLLM(model, pineconeStore.asRetriever());

export async function callChain(msg, history = []) {
  const res = await chains._call({
    question: msg,
    chat_history: () => history,
  });
  return res;
}
