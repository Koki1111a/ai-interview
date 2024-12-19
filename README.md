# Adapted Interview

Adapted Interviewは、AIアバターとの模擬面接ができる面接ツールです。

コワモテの面接官アバターが、選択した企業の情報と提出したESに基づいた質問をしてくれます。

---

Adapted Interviewは、pixivのChatVRMを改良して開発したものです。

- [ChatVRM](https://github.com/pixiv/ChatVRM)

---

Adapted Interviewの各機能は主に以下の技術を使用しています。

- ユーザーの音声の認識
    - [Web Speech API(SpeechRecognition)](https://developer.mozilla.org/ja/docs/Web/API/SpeechRecognition)
- 返答文の生成
    - [Claude 3.5 Sonnet](https://aws.amazon.com/jp/bedrock/claude/)
- 読み上げ音声の生成
    - [Koemotion/Koeiromap API](https://koemotion.rinna.co.jp/)
- 3Dキャラクターの表示
    - [@pixiv/three-vrm](https://github.com/pixiv/three-vrm)


## 実行
ローカル環境で実行する場合はこのリポジトリをクローンするか、ダウンロードしてください。
```bash
git clone git@github.com:Koki1111a/ai-interview.git
```

ルートディレクトリに以下のようなファイル```.env```をおいてください。
`< >`の部分は実際のキーやIDで書き換えてください。
```.env
NEXT_PUBLIC_AWS_ACCESS_KEY=<your_aws_access_key>
NEXT_PUBLIC_AWS_SECRET_KEY=<your_aws_secret_key>
NEXT_PUBLIC_AWS_AGENT_ID_DOCOMO=<docomo_agent_id>
NEXT_PUBLIC_AWS_ALIAS_ID_DOCOMO=<docomo_alias_id>
NEXT_PUBLIC_AWS_AGENT_ID_KDDI=<kddi_agent_id>
NEXT_PUBLIC_AWS_ALIAS_ID_KDDI=<kddi_alias_id>
NEXT_PUBLIC_AWS_AGENT_ID_SOFTBANK=<softbank_agent_id>
NEXT_PUBLIC_AWS_ALIAS_ID_SOFTBANK=<softbank_alias_id>
```

必要なパッケージをインストールしてください。
```bash
npm install
```

パッケージのインストールが完了した後、以下のコマンドで開発用のWebサーバーを起動します。
```bash
npm run dev
```

実行後、以下のURLにアクセスして動作を確認して下さい。

[http://localhost:3000](http://localhost:3000) 


---

## Koeiromap API
ChatVRMでは返答文の音声読み上げにKoemotionのKoeiromap APIを使用しています。

Koeiromap APIの仕様や利用規約については以下のリンクや公式サイトをご確認ください。

- [https://koemotion.rinna.co.jp/](https://koemotion.rinna.co.jp/)
