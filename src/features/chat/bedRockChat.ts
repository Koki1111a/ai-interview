import {
    BedrockAgentRuntimeClient,
    InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

import { v4 as uuidv4 } from 'uuid';

import dotenv from "dotenv";

import "@/components/introduction";
import { companyName } from "@/components/introduction";
  
/**
 * @typedef {Object} ResponseBody
 * @property {string} completion
 */

/**
 * Invokes a Bedrock agent to run an inference using the input
 * provided in the request body.
 *
 * @param {string} prompt - The prompt that you want the Agent to complete.
 * @param {string} sessionId - An arbitrary identifier for the session.
 */

export const getChatResponseAWS = async (prompt: string) => {
    dotenv.config();

    const access_key_id = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY;
    const secret_access_key = process.env.NEXT_PUBLIC_AWS_SECRET_KEY;

    if (access_key_id === undefined) {
        throw new Error("AWS_ACCESS_KEY is undefined");
    }

    if (secret_access_key === undefined) {
        throw new Error("AWS_SECRET_KEY is undefined");
    }

    const client = new BedrockAgentRuntimeClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: access_key_id,
        secretAccessKey: secret_access_key,
      },
    });

    const sessionId = uuidv4();

    let agentIdTemp,agentAliasIdTemp;    
    if(companyName == "docomo"){
        console.log("docomo");
        agentIdTemp = process.env.NEXT_PUBLIC_AWS_AGENT_ID_DOCOMO;
        agentAliasIdTemp = process.env.NEXT_PUBLIC_AWS_ALIAS_ID_DOCOMO;
        
    }
    else if(companyName == "kddi"){
        console.log("kddi");
        agentIdTemp = process.env.NEXT_PUBLIC_AWS_AGENT_ID_KDDI;
        agentAliasIdTemp = process.env.NEXT_PUBLIC_AWS_ALIAS_ID_KDDI;
    }
    else if(companyName == "softbank"){
        console.log("softbank");
        agentIdTemp = process.env.NEXT_PUBLIC_AWS_AGENT_ID_SOFTBANK;
        agentAliasIdTemp = process.env.NEXT_PUBLIC_AWS_ALIAS_ID_SOFTBANK;
    }
    else{
        console.log("none");
    }
    const agentId = agentIdTemp;
    const agentAliasId = agentAliasIdTemp;

    if (agentId === undefined || agentAliasId === undefined) {
        throw new Error("AWS_AGENT_ID or AWS_ALIAS_ID is undefined");
    }

    const command = new InvokeAgentCommand({
        agentId,
        agentAliasId,
        sessionId,
        inputText: prompt,
    });

    try {
        let completion = "";
        const response = await client.send(command);

        if (response.completion === undefined || !response) {
            throw new Error("Invalid response from Bedrock agent");
        }
        
        return response;
    } catch (err) {
        console.error(err);
    }
};
