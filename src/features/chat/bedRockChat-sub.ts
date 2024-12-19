
import {
    BedrockAgentRuntimeClient,
    InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

import { v4 as uuidv4 } from 'uuid';

import dotenv from "dotenv";
  
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

    
    const agentId = process.env.NEXT_PUBLIC_AWS_AGENT_ID;
    const agentAliasId = process.env.NEXT_PUBLIC_AWS_ALIAS_ID;

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

        if (response.completion === undefined) {
            throw new Error("Completion is undefined");
        }

        for await (let chunkEvent of response.completion) {
            const chunk = chunkEvent.chunk;
            console.log(chunk);
            if (chunk !== undefined) {
                const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
                completion += decodedResponse;
                console.log("decodedResponse:", decodedResponse);
            }
        }
        console.log("質問内容：", prompt);
        console.log(completion);

        return { sessionId: sessionId, completion };
    } catch (err) {
        console.error(err);
    }
};
  
  // Call function if run directly
//   import { fileURLToPath } from "url";
//   if (process.argv[1] === fileURLToPath(import.meta.url)) {
//     const result = await invokeBedrockAgent("I need help.", "123");
//     console.log(result);
//   }
  
  