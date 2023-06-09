/** @format */
import { UnstructuredLoader } from "langchain/document_loaders/fs/unstructured";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import HttpsProxyAgent from "https-proxy-agent";

import dotenv from "dotenv";
dotenv.config();
const unstructuredLoader = new UnstructuredLoader("./markdown.md");
const rawDocs = await unstructuredLoader.load();

// console.log(rawDocs);

const splitter = new RecursiveCharacterTextSplitter({
  chunkOverlap: 200,
  chunkSize: 1000,
});

const docs = await splitter.splitDocuments(rawDocs);
// console.log(docs);

const pineconeClient = new PineconeClient();
await pineconeClient.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIROMENT,
});
const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX);

const agent = new HttpsProxyAgent.HttpsProxyAgent(process.env.http_proxy);
try {
  const openAIEmbeddings = new OpenAIEmbeddings(undefined, {
    baseOptions: {
      httpsAgent: agent,
    },
  });
  PineconeStore.fromDocuments(docs, openAIEmbeddings, {
    pineconeIndex,
    textKey: "text",
    namespace: "vue3-chatbot",
  });
} catch (error) {
  console.log(error);
}
