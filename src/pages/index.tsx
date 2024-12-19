import { useCallback, useContext, useEffect, useState } from "react";
import VrmViewer from "@/components/vrmViewer";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";
import {
  Message,
  textsToScreenplay,
  Screenplay,
} from "@/features/messages/messages";
import { speakCharacter } from "@/features/messages/speakCharacter";
import { MessageInputContainer } from "@/components/messageInputContainer";
import { SYSTEM_PROMPT } from "@/features/constants/systemPromptConstants";
import { KoeiroParam, DEFAULT_PARAM } from "@/features/constants/koeiroParam";
import { getChatResponseAWS } from "@/features/chat/bedRockChat";
import { Introduction } from "@/components/introduction";
import { Menu } from "@/components/menu";
import { GitHubLink } from "@/components/githubLink";
import { Meta } from "@/components/meta";

export default function Home() {
  const { viewer } = useContext(ViewerContext);

  const [systemPrompt, setSystemPrompt] = useState(SYSTEM_PROMPT);
  const [openAiKey, setOpenAiKey] = useState("");
  const [koeiromapKey, setKoeiromapKey] = useState("");
  const [koeiroParam, setKoeiroParam] = useState<KoeiroParam>(DEFAULT_PARAM);
  const [chatProcessing, setChatProcessing] = useState(false);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [assistantMessage, setAssistantMessage] = useState("");

  useEffect(() => {
    if (window.localStorage.getItem("chatVRMParams")) {
      const params = JSON.parse(
        window.localStorage.getItem("chatVRMParams") as string
      );
      setSystemPrompt(params.systemPrompt ?? SYSTEM_PROMPT);
      setKoeiroParam(params.koeiroParam ?? DEFAULT_PARAM);
      setChatLog(params.chatLog ?? []);
    }
  }, []);

  useEffect(() => {
    process.nextTick(() =>
      window.localStorage.setItem(
        "chatVRMParams",
        JSON.stringify({ systemPrompt, koeiroParam, chatLog })
      )
    );
  }, [systemPrompt, koeiroParam, chatLog]);

  const handleChangeChatLog = useCallback(
    (targetIndex: number, text: string) => {
      const newChatLog = chatLog.map((v: Message, i) => {
        return i === targetIndex ? { role: v.role, content: text } : v;
      });

      setChatLog(newChatLog);
    },
    [chatLog]
  );

  /**
   * 文ごとに音声を直列でリクエストしながら再生する
   */
  const handleSpeakAi = useCallback(
    async (
      screenplay: Screenplay,
      onStart?: () => void,
      onEnd?: () => void
    ) => {
      speakCharacter(screenplay, viewer, koeiromapKey, onStart, onEnd);
    },
    [viewer, koeiromapKey]
  );

  /**
   * アシスタントとの会話を行う
   */
  const sendChat = async(me: string) => {
      const newMessage = me;

      if (newMessage == null) return;

      setChatProcessing(true);
      // ユーザーの発言を追加して表示
      const messageLog: Message[] = [
        ...chatLog,
        { role: "user", content: newMessage },
      ];
      setChatLog(messageLog);

      const resposne = await getChatResponseAWS(newMessage).catch(
        (e) => {
          console.error(e);
          return null;
        }
      );

        if (!resposne || !resposne.completion) {
            console.error("Chat response is invalid");
            setChatProcessing(false);
            return;
        }

      let receivedMessage = "";
      let aiTextLog = "";
      let tag = "";
      const sentences = new Array<string>();
      try {
        for await (let chunkEvent of resposne.completion) {
            const chunk = chunkEvent.chunk;
            if (chunk !== undefined) {
                // const buffer = new TextEncoder().encode(chunk.toString()).buffer;
                // const decodedResponse = new TextDecoder("utf-8").decode(buffer);
                const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
                console.log("decodedResponse:", decodedResponse);
                receivedMessage += decodedResponse;
            }

            // 返答内容のタグ部分の検出
            const tagMatch = receivedMessage.match(/^\[(.*?)\]/);
            if (tagMatch && tagMatch[0]) {
                tag = tagMatch[0];
                receivedMessage = receivedMessage.slice(tag.length);
            }

            if (receivedMessage.length >= 60){
              
            }

            // 返答を一文単位で切り出して処理する
            const sentenceMatch = receivedMessage.matchAll(
                /(.+?[。！？\n]|.{20,}[、,.。．！？\n])/g
            );
            if (sentenceMatch) {
                // const sentence = sentenceMatch[0];
                // console.log("sentence:", sentence);
                // sentences.push(sentence);
                // receivedMessage = receivedMessage
                // .slice(sentence.length)
                // .trimStart();
                // console.log("recievedMessage:", receivedMessage);

                console.log("sentenceMatch", sentenceMatch);

                // 発話不要/不可能な文字列だった場合はスキップ
                for (const sentence of sentenceMatch) {
                  console.log("sentence:", sentence[0]);
                  sentences.push(sentence[0].toString());
                  if (
                    !sentence.toString().replace(
                        /^[\s\[\(\{「［（【『〈《〔｛«‹〘〚〛〙›»〕》〉』】）］」\}\)\]]+$/g,
                        ""
                    )
                  ) {
                    console.log("sentence", sentence[0]);
                    continue;
                  }

                  const aiText = `${tag} ${sentence[0]}`;
                  console.log("aiText:", aiText);
                  const aiTalks = textsToScreenplay([aiText], koeiroParam);
                  aiTextLog += aiText;

                  // 文ごとに音声を生成 & 再生、返答を表示
                  const currentAssistantMessage = sentences.join(" ");
                  console.log("currentAssistantMessage:", currentAssistantMessage);
                  handleSpeakAi(aiTalks[0], () => {
                    setAssistantMessage(currentAssistantMessage);
                  });
              }
          }
        }
      } catch (e) {
        setChatProcessing(false);
        console.error(e);
      }
      // アシスタントの返答をログに追加
      const messageLogAssistant: Message[] = [
        ...messageLog,
        { role: "assistant", content: aiTextLog },
      ];

      setChatLog(messageLogAssistant);
      setChatProcessing(false);
  }


  const handleSendChat = useCallback(
    async (text: string) => {
      sendChat(text);
    },
    [systemPrompt, chatLog, handleSpeakAi, openAiKey, koeiroParam]
  );

  return (
    <div className={"font-Sans_Serif"}>
      <Meta />
      <Introduction
        onStartInterview = {sendChat}
      />
      <VrmViewer />
      <MessageInputContainer
        isChatProcessing={chatProcessing}
        onChatProcessStart={handleSendChat}
      />
      <Menu
        openAiKey={openAiKey}
        systemPrompt={systemPrompt}
        chatLog={chatLog}
        koeiroParam={koeiroParam}
        assistantMessage={assistantMessage}
        koeiromapKey={koeiromapKey}
        onChangeAiKey={setOpenAiKey}
        onChangeSystemPrompt={setSystemPrompt}
        onChangeChatLog={handleChangeChatLog}
        onChangeKoeiromapParam={setKoeiroParam}
        handleClickResetChatLog={() => setChatLog([])}
        handleClickResetSystemPrompt={() => setSystemPrompt(SYSTEM_PROMPT)}
        onChangeKoeiromapKey={setKoeiromapKey}
      />
      <GitHubLink />
    </div>
  );
}
