"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, CheckCircle, XCircle, Settings, BarChart3 } from "lucide-react"
import Link from "next/link"

interface UserProgress {
  totalQuestionsAnswered: number
  correctAnswers: number
  categoryProgress: Record<string, { answered: number; correct: number }>
  studyStreak: number
  lastStudyDate: string
}

export default function HomePage() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalQuestionsAnswered: 0,
    correctAnswers: 0,
    categoryProgress: {},
    studyStreak: 0,
    lastStudyDate: "",
  })

  useEffect(() => {
    const savedProgress = localStorage.getItem("aromaQuizProgress")
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress))
    }
  }, [])

  const accuracyRate =
    userProgress.totalQuestionsAnswered > 0
      ? Math.round((userProgress.correctAnswers / userProgress.totalQuestionsAnswered) * 100)
      : 0

  const today = new Date().toISOString().split("T")[0]
  const isStudiedToday = userProgress.lastStudyDate === today

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-green-800 mb-2">AromaQuiz Pro</h1>
          <p className="text-green-600">AEAJ インストラクター試験対策</p>
        </div>

        {/* Today's Study Status */}
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-800 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              今日の学習状況
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">学習ステータス</span>
              <div className="flex items-center gap-2">
                {isStudiedToday ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">完了</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">未学習</span>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>総正答率</span>
                <span className="font-medium">{accuracyRate}%</span>
              </div>
              <Progress value={accuracyRate} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-700">{userProgress.totalQuestionsAnswered}</div>
                <div className="text-xs text-gray-500">解答数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-700">{userProgress.studyStreak}</div>
                <div className="text-xs text-gray-500">連続学習日数</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Learning Menu */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-green-800">学習メニュー</h2>

          <Link href="/quiz">
            <Card className="border-green-200 hover:bg-green-50 transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-800">問題演習</h3>
                  <p className="text-sm text-gray-600">カテゴリー別の問題練習</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Review Menu */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-green-800">復習メニュー</h2>

          <Link href="/quiz?mode=wrong">
            <Card className="border-red-200 hover:bg-red-50 transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800">間違い問題</h3>
                  <p className="text-sm text-gray-600">間違えた問題を集中復習</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/quiz?mode=checked">
            <Card className="border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-800">チェック問題</h3>
                  <p className="text-sm text-gray-600">重要とマークした問題</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Settings */}
        <Link href="/settings">
          <Card className="border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <Settings className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">設定</h3>
                <p className="text-sm text-gray-600">アプリの設定とデータ管理</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
