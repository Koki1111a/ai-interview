import { useState, useCallback, useEffect } from "react";
import { TextButton } from "./textButton";
import { Link } from "./link";
import {
  Radar, RadarChart, PolarGrid, Legend,
  PolarAngleAxis, PolarRadiusAxis,Tooltip,
  ResponsiveContainer,
} from 'recharts';

const dataRadar = [
  { rank: '自己PRの内容', value: 80, average: 50 },
  { rank: '企業とのマッチ度', value: 85, average: 50 },
  { rank: '企業理解', value: 65, average: 50 },
  ];

type Props = {
  onClickClose: () => void;
};

export const Result = ({
  onClickClose,
}: Props) => {
  const [opened, setOpened] = useState(true);


  // リフレッシュボタンのクリックハンドラー
  const handleRefreshClick = useCallback(() => {
    window.location.reload(); // ページをリロードする
  }, []);

  return (opened) ? (
    <div className="absolute z-40 w-full h-full px-24 py-40  bg-black/30 font-Sans_Serif">
      <div className="mx-auto my-auto max-w-3xl max-h-full p-24 overflow-auto bg-white rounded-16">
        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            面談終了お疲れさまでした！
          </div>
          <div>
          以下の評価を参考に、今後のスキル向上に役立ててください。
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart // レーダーチャートのサイズや位置、データを指定
            height={400} //レーダーチャートの全体の高さを指定
            width={650} //レーダーチャートの全体の幅を指定
            cx="50%" //要素の左を基準に全体の50%移動
            cy="50%" //要素の上を基準に全体の50%移動
            data={dataRadar} //ここにArray型のデータを指定
          >
            <PolarGrid /> // レーダーのグリッド線を表示
            <PolarAngleAxis
              dataKey="rank" //Array型のデータの、数値を表示したい値のキーを指定
            />
            <Radar //レーダーの色や各パラメーターのタイトルを指定
              name="あなた"  //hoverした時に表示される名前を指定 
              dataKey="value" //Array型のデータのパラメータータイトルを指定
              stroke="#007BFF"  //レーダーの線の色を指定
              fill="#007BFF" //レーダーの中身の色を指定
              fillOpacity={0.6} //レーダーの中身の色の薄さを指定
            />
            <Radar //レーダーの色や各パラメーターのタイトルを指定
              name="平均"  //hoverした時に表示される名前を指定 
              dataKey="average" //Array型のデータのパラメータータイトルを指定
              stroke="#FF5733"  //レーダーの線の色を指定
              fill="#FF5733" //レーダーの中身の色を指定
              fillOpacity={0.4} //レーダーの中身の色の薄さを指定
            />
            <Tooltip /> //hoverすると各パラメーターの値が表示される
          </RadarChart>
        </ResponsiveContainer>

        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            自己PRの内容
          </div>
          <div>
          自己PRでは、あなたの誠実さと責任感がよく伝わってきました。
          また、挑戦する意欲も素晴らしいです。
          ただ、もう少し具体的なエピソードや、どのように成果を上げたかを詳しく説明することで、さらに説得力が増すと思います。
          </div>
        </div>

        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            企業とのマッチ度
          </div>
          <div>
          今回の面接では、あなたのスキルセットや経験が我々の業務内容と非常にマッチしていると感じました。
          特に○○に関する知識や△△のプロジェクトでの実績が、当社が現在注力している領域に合致しています。
          しかし、もう少し企業のカルチャーや価値観に対する理解を深め、
          どのように自分がそれらと一致しているかをアピールできるとさらに良かったと思います。
          当社はチームワークやオープンなコミュニケーションを重視しているため、その部分を強調していただけると、
          よりマッチ度が高く感じられたでしょう。
          </div>
        </div>

        <div className="my-24">
          <div className="my-8 font-bold typography-20 text-secondary">
            企業理解
          </div>
          <div>
          今回の面接では、企業理解についてもう少し深掘りができると良かったと思います。
          会社のビジョンや業界の動向について、表面的な情報ではなく、もう少し具体的な例を交えて話せると、
          御社に対する興味や理解がさらに伝わるでしょう。
          例えば、最新の製品やサービスがどのように市場に影響を与えているか、
          またそれに関連する自分のスキルや経験をどのように活かせるかについて触れると、より説得力が増します。
          加えて、企業の文化や価値観が自身と合致している点を強調すると、長期的なビジョンも共有できると思います。
          </div>
        </div>
        
        <div className="my-24">
          <div>
          次回の面談に向けて頑張ってください！
          </div>
          <div className="flex my-8">
            <div className="m-8">
              <TextButton onClick={handleRefreshClick}>ホームに戻る</TextButton>
            </div>
            <div className="m-8">
              <TextButton onClick={onClickClose}>戻る</TextButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};