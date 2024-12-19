import { koeiromapFreeV1 } from "@/features/koeiromap/koeiromap";
import axios from 'axios';

import type { NextApiRequest, NextApiResponse } from "next";

import dotenv from "dotenv";

type Data = {
  audio: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const message = req.body.message;
  const speakerX = req.body.speakerX;
  const speakerY = req.body.speakerY;
  const style = req.body.style;

  dotenv.config();
  const coemotion_api = process.env.NEXT_PUBLIC_COEMOTION_API_KEY;
  
  if (!coemotion_api){
    throw new Error("Invalid API Key");
  }

  console.log(message);

  const request_json = {
    "text": message,
    "version": "2.0",
    "speaker_x": -7,
    "speaker_y": -7,
    "style": "talk",
    "style_predict": false,
    "seed": 984298612,
    "speed": 1,
    "volume": 0,
    "output_format": "mp3",
    "output_bitrate": 128,
    "facemotion": false,
    "streaming": false
  }

const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "no-cache",
  "Ocp-Apim-Subscription-Key": coemotion_api,
};

const response = await axios.post(
  'https://api.rinna.co.jp/koemotion/infer', 
  request_json,
  { headers }
)

res.status(200).json(response.data.audio);

}
