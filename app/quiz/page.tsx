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
import chapter4Questions from "@/data/chapter4-questions.json"
import chapter5_1Questions from "@/data/chapter5-1-questions.json"
import chapter5_2Questions from "@/data/chapter5-2-questions.json"
import chapter5_3Questions from "@/data/chapter5-3-questions.json"
import chapter6Questions from "@/data/chapter6-questions.json"
import chapter7Questions from "@/data/chapter7-questions.json"
import chapter8Questions from "@/data/chapter8-questions.json"
import chapter9_1Questions from "@/data/chapter9-1-questions.json"
import chapter9_2Questions from "@/data/chapter9-2-questions.json"

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
  // Chapter 1: アロマテラピーの源流を知る（15問）
  ...(chapter1Questions as Question[]),

  // Chapter 2: 植物を知る（15問）
  ...(chapter2Questions as Question[]),

  // Chapter 3: 精油を知る（15問）
  ...(chapter3Questions as Question[]),

  // Chapter 4: 人体を知る（10問）
  ...(chapter4Questions as Question[]),

  // Chapter 5: 精油を使う-不調とアロマテラピー（32問）
  // 5-1: 自律神経と呼吸（12問）
  ...(chapter5_1Questions as Question[]),
  // 5-2: ホルモンバランス・女性の不調（11問）
  ...(chapter5_2Questions as Question[]),
  // 5-3: 皮膚の構造と働き（9問）
  ...(chapter5_3Questions as Question[]),

  // Chapter 6: 精油を使う-痛みとアロマテラピー
  ...(chapter6Questions as Question[]),

  // Chapter 7: 健康の基本
  ...(chapter7Questions as Question[]),

  // Chapter 8: ケーススタディ
  ...(chapter8Questions as Question[]),

  // Chapter 9: アロマテラピーインストラクターとして活動する
  // 9-1: さまざまな分野で活動する・支持されるインストラクターになるために
  ...(chapter9_1Questions as Question[]),
  // 9-2: エビデンスと知識のアップデート
  ...(chapter9_2Questions as Question[]),
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
