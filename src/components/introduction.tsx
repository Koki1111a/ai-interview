import { useState, useCallback, useEffect } from "react";
import { Link } from "./link";

// 企業データの配列を定義
const companyOptions = [
  { value: "docomo", label: "NTT ドコモ" },
  { value: "kddi", label: "KDDI" },
  { value: "softbank", label: "ソフトバンク" },
];

type Props = {};

type ButtonComponentProps = {
  onStartInterview: (mes : string) => Promise<void>;
};

export let companyName: string;

export const Introduction: React.FC<ButtonComponentProps> = ({ onStartInterview }) => {

  const [opened, setOpened] = useState(true);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedValue(event.target.value);
    },
    []
  );

  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    },
    []
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
      }
    },
    []
  );

  const uploadFile = async (file: File) => {
    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.text();
        // setMessage(`File uploaded successfully: ${result}`);
      } else {
        // setMessage('File upload failed.');
      }
    } catch (error) {
      // setMessage('Error uploading file.');
    } finally {
      setMessage('アップロード完了');
      setUploading(false);
    }
  };

  const initIntroduction = () => {
    setOpened(false);
    onStartInterview(`私の名前は${name}です。本日はよろしくお願いします。`);
  }

  useEffect(() => {
    const className = `bg-${selectedValue}`;

    // 既存の背景クラスを削除（必要に応じて）
    document.body.classList.forEach(cls => {
      if (cls.startsWith('bg-')) {
        document.body.classList.remove(cls);
      }
    });

    // 新しいクラスを追加
    document.body.classList.add(className);

    // クリーンアップ関数でクラスを削除（コンポーネントのアンマウント時）
    return () => {
      document.body.classList.remove(className);
    };
  }, [selectedValue]);

  return (opened) ? (
    <div className="absolute z-40 w-full h-full px-24 py-40  bg-black/30 font-Sans_Serif">
      <div className="mx-auto my-auto max-w-3xl max-h-full p-24 overflow-auto bg-white rounded-16">
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            AI面接練習アプリへようこそ！
          </div>
          <div>
          このアプリは、Webブラウザだけで簡単に面接の練習ができるツールです。<br />
          企業を選択することで、その企業に合わせた質問内容に変更し、リアルな面接体験を提供します。<br />
          また、エントリーシートをアップロードすることで、あなたのエントリーシートに沿った質問が返ってきます。<br />
          実際の面接に備えて、しっかりと準備を整えましょう。
          </div>
        </div>

        <div className="my-24">
          <label className="block my-8 font-bold typography-20 text-secondary">
            名前:
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="名前を入力してください"
            className="w-full px-16 py-8 border rounded-8"
          />
        </div>

        <div className="my-24">
          <label className="block my-8 font-bold typography-20 text-secondary">
            企業を選択:
          </label>
          <select
            value={selectedValue}
            onChange={handleSelectChange}
            className="w-full px-16 py-8 border rounded-8"
          >
            <option value="" disabled>
              企業を選択してください
            </option>
            {companyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="my-24">
          <label className="block my-8 font-bold typography-20 text-secondary">
            エントリーシートをアップロード:
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full px-16 py-8 rounded-8"
          />
          {file && (
            <button
              onClick={() => file && uploadFile(file)}
              disabled={uploading}
              className={`mt-4 font-bold px-24 py-8 rounded-oval text-white ${
                uploading
                  ? "bg-secondary-disabled"
                  : "bg-secondary hover:bg-secondary-hover active:bg-secondary-press"
              }`}
            >
              {uploading ? 'アップロード中' : 'アップロードする'}
            </button>
          )}
          {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
        
        <div className="my-24">
        <button
            onClick={() => {
              if (selectedValue !== "" && name !== "") {
                companyName = selectedValue;
                initIntroduction();
                setOpened(false);
                
              }
            }}
            disabled={selectedValue === ""}
            className={`font-bold px-24 py-8 rounded-oval text-white ${
              selectedValue === "" || name === ""
                ? "bg-secondary-disabled"
                : "bg-secondary hover:bg-secondary-hover active:bg-secondary-press"
            }`}
          >
            面接開始
          </button>
        </div>
      </div>
    </div>
  ) : null;
};
