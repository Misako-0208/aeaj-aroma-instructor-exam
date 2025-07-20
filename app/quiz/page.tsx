"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

// データファイルのインポート
import chapter1Questions from "@/data/chapter1-questions.json"
import chapter2Questions from "@/data/chapter2-questions.json"
import chapter3Questions from "@/data/chapter3-questions.json"

interface Question {
  id: string
  category: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "basic" | "intermediate" | "advanced"
  tags?: string[]
}

// 全カテゴリーの問題データを統合
const allQuestions: Question[] = [
  ...(chapter1Questions as Question[]),
  ...(chapter2Questions as Question[]),
  ...(chapter3Questions as Question[]),
  
  // その他のチャプターのサンプル問題
  {
    id: "ch4_q001",
    category: "人体を知る",
    difficulty: "basic" as const,
    question: "嗅覚情報が最初に到達する脳の部位はどこか？",
    options: ["大脳皮質", "嗅球", "視床下部", "海馬"],
    correctAnswer: 1,
    explanation: "嗅覚情報は鼻腔の嗅上皮から嗅神経を通じて、まず嗅球に到達します。",
    tags: ["嗅覚", "嗅球", "嗅神経"],
  },
  {
    id: "ch5_q001",
    category: "精油を使う-不調とアロマテラピー",
    difficulty: "basic" as const,
    question: "ストレス軽減に最も適している精油の特性はどれか？",
    options: ["刺激作用", "鎮静作用", "収斂作用", "去痰作用"],
    correctAnswer: 1,
    explanation: "ストレス軽減には鎮静作用のある精油が最も適しています。",
    tags: ["ストレス軽減", "鎮静作用"],
  },
  {
    id: "ch6_q001",
    category: "精油を使う-痛みとアロマテラピー",
    difficulty: "basic" as const,
    question: "筋肉の緊張による痛みに対して最も適した精油の作用はどれか？",
    options: ["収斂作用", "抗炎症作用", "筋弛緩作用", "利尿作用"],
    correctAnswer: 2,
    explanation: "筋肉の緊張による痛みには筋弛緩作用のある精油が最も適しています。",
    tags: ["筋肉痛", "筋弛緩作用"],
  },
  {
    id: "ch7_q001",
    category: "健康の基本",
    difficulty: "basic" as const,
    question: "健康の基本となる3つの原則として正しい組み合わせはどれか？",
    options: ["食事・睡眠・運動", "食事・睡眠・入浴", "睡眠・運動・ストレス発散", "食事・運動・人間関係"],
    correctAnswer: 0,
    explanation: "健康の基本となる3つの原則は「食事・睡眠・運動」です。",
    tags: ["健康3原則"],
  },
  {
    id: "ch8_q001",
    category: "ケーススタディ",
    difficulty: "intermediate" as const,
    question: "企業での健康経営推進におけるアロマテラピー活用で最も重要な点はなにか？",
    options: ["高価な精油を使用すること", "従業員のニーズに合わせた安全な活用法", "強い香りで職場環境を変えること", "全員に同じ精油を使用すること"],
    correctAnswer: 1,
    explanation: "企業での健康経営推進では、従業員のニーズに合わせた安全な活用法が最も重要です。",
    tags: ["健康経営"],
  },
  {
    id: "ch9_q001",
    category: "アロマテラピーインストラクターとして活動する",
    difficulty: "basic" as const,
    question: "アロマテラピーインストラクターに最も重要な資質はなにか？",
    options: ["豊富な精油コレクション", "ホスピタリティとマナー", "高度な化学知識", "長年の実践経験"],
    correctAnswer: 1,
    explanation: "アロマテラピーインストラクターにとって最も重要なのは、ホスピタリティとマナーです。",
    tags: ["インストラクター"],
  },
]

const categories = [
  "アロマテラピーの源流を知る",
  "植物を知る", 
  "精油を知る",
  "人体を知る",
  "精油を使う-不調とアロマテラピー",
  "精油を使う-痛みとアロマテラピー",
  "健康の基本",
  "ケーススタディ",
  "アロマテラピーインストラクターとして活動する",
]

const questionCounts = [5, 10, 20, "全問"]

// カテゴリー別問題数を取得する関数
const getQuestionCount = (category: string): number => {
  return allQuestions.filter(q => q.category === category).length
}

export default function QuizPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedCount, setSelectedCount] = useState<number | string>("")
  const [mode, setMode] = useState<string>("normal")
  const searchParams = useSearchParams()

  useEffect(() => {
    const modeParam = searchParams.get("mode")
    if (modeParam) {
      setMode(modeParam)
    }
  }, [searchParams])

  const getModeTitle = () => {
    switch (mode) {
      case "wrong":
        return "間違い問題復習"
      case "checked":
        return "チェック問題復習"
      default:
        return "問題演習"
    }
  }

  const getModeColor = () => {
    switch (mode) {
      case "wrong":
        return "text-red-800"
      case "checked":
        return "text-blue-800"
      default:
        return "text-green-800"
    }
  }

  const canStartQuiz = selectedCategory && selectedCount

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className={`text-xl font-bold ${getModeColor()}`}>{getModeTitle()}</h1>
            <p className="text-sm text-gray-600">カテゴリーと問題数を選択</p>
          </div>
        </div>

        {/* Category Selection */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-lg text-green-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              カテゴリー選択
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((category) => {
              const questionCount = getQuestionCount(category)
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`w-full justify-between h-auto p-3 ${
                    selectedCategory === category
                      ? "bg-green-600 hover:bg-green-700"
                      : "border-green-200 hover:bg-green-50"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <span className="text-left font-medium text-sm leading-tight flex-1">
                    {category}
                  </span>
                  <Badge 
                    variant={selectedCategory === category ? "secondary" : "outline"}
                    className={`ml-2 text-xs ${
                      selectedCategory === category 
                        ? "bg-white/20 text-white border-white/30" 
                        : "bg-green-50 text-green-700 border-green-200"
                    }`}
                  >
                    {questionCount}問
                  </Badge>
                </Button>
              )
            })}
          </CardContent>
        </Card>

        {/* Question Count Selection */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-lg text-green-800">問題数選択</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {questionCounts.map((count) => (
                <Button
                  key={count}
                  variant={selectedCount === count ? "default" : "outline"}
                  className={`h-16 ${
                    selectedCount === count ? "bg-green-600 hover:bg-green-700" : "border-green-200 hover:bg-green-50"
                  }`}
                  onClick={() => setSelectedCount(count)}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">{count}</div>
                    <div className="text-xs opacity-70">{typeof count === "number" ? "問" : ""}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Options Summary */}
        {(selectedCategory || selectedCount) && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-green-800 mb-2">選択内容</h3>
              <div className="space-y-2">
                {selectedCategory && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">カテゴリー:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {selectedCategory}
                    </Badge>
                  </div>
                )}
                {selectedCount && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">問題数:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {selectedCount}
                      {typeof selectedCount === "number" ? "問" : ""}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start Quiz Button */}
        <div className="pt-4">
          <Link
            href={
              canStartQuiz
                ? `/quiz/practice?category=${encodeURIComponent(selectedCategory)}&count=${selectedCount}&mode=${mode}`
                : "#"
            }
          >
            <Button
              className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700 disabled:opacity-50"
              disabled={!canStartQuiz}
            >
              {canStartQuiz ? "学習開始" : "カテゴリーと問題数を選択してください"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
