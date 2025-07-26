"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Check, X, Bookmark, BookmarkCheck, RotateCcw, HelpCircle } from "lucide-react"
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

  // Chapter 6: 精油を使う-痛みとアロマテラピー（サンプル1問）
  {
    id: "ch6_q001",
    category: "精油を使う-痛みとアロマテラピー",
    difficulty: "basic" as const,
    question: "筋肉の緊張による痛みに対して最も適した精油の作用はどれか？",
    options: ["収斂作用", "抗炎症作用", "筋弛緩作用", "利尿作用"],
    correctAnswer: 2,
    explanation: "筋肉の緊張による痛みには筋弛緩作用のある精油が最も適しています。ラベンダー、マジョラム、ローズマリーなどに含まれる成分が筋肉の緊張を和らげ、痛みの軽減に役立ちます。",
    tags: ["筋肉痛", "筋弛緩作用", "緊張"],
  },

  // Chapter 7: 健康の基本（サンプル1問）
  {
    id: "ch7_q001",
    category: "健康の基本",
    difficulty: "basic" as const,
    question: "健康の基本となる3つの原則として正しい組み合わせはどれか？",
    options: ["食事・睡眠・運動", "食事・睡眠・入浴", "睡眠・運動・ストレス発散", "食事・運動・人間関係"],
    correctAnswer: 0,
    explanation: "健康の基本となる3つの原則は「食事・睡眠・運動」です。これらのバランスが取れることで心身の健康が維持され、アロマテラピーはこれらの質を高めるサポートを行うことができます。",
    tags: ["健康3原則", "食事", "睡眠", "運動"],
  },

  // Chapter 8: ケーススタディ（サンプル1問）
  {
    id: "ch8_q001",
    category: "ケーススタディ",
    difficulty: "intermediate" as const,
    question: "企業での健康経営推進におけるアロマテラピー活用で最も重要な点はなにか？",
    options: ["高価な精油を使用すること", "従業員のニーズに合わせた安全な活用法", "強い香りで職場環境を変えること", "全員に同じ精油を使用すること"],
    correctAnswer: 1,
    explanation: "企業での健康経営推進では、従業員一人ひとりのニーズや体調を考慮し、安全で効果的なアロマテラピーの活用法を提案することが最も重要です。個人差や好み、アレルギーの有無なども考慮する必要があります。",
    tags: ["健康経営", "企業", "安全性"],
  },

  // Chapter 9: アロマテラピーインストラクターとして活動する（サンプル1問）
  {
    id: "ch9_q001",
    category: "アロマテラピーインストラクターとして活動する",
    difficulty: "basic" as const,
    question: "アロマテラピーインストラクターに最も重要な資質はなにか？",
    options: ["豊富な精油コレクション", "ホスピタリティとマナー", "高度な化学知識", "長年の実践経験"],
    correctAnswer: 1,
    explanation: "アロマテラピーインストラクターにとって最も重要なのは、相手に対する思いやりの心（ホスピタリティ）と適切なマナーです。知識や技術も大切ですが、まず人としての基本的な姿勢が信頼関係の構築につながります。",
    tags: ["インストラクター", "ホスピタリティ", "マナー"],
  },
]

export default function PracticePage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])
  const [checkedQuestions, setCheckedQuestions] = useState<Set<string>>(new Set())
  const [wrongQuestions, setWrongQuestions] = useState<Set<string>>(new Set())

  const searchParams = useSearchParams()
  const category = searchParams.get("category") || ""
  const count = searchParams.get("count") || "5"
  const mode = searchParams.get("mode") || "normal"

  useEffect(() => {
    // カテゴリーと問題数に基づいて問題を取得
    const filteredQuestions = allQuestions.filter((q) => q.category === category)
    const questionCount = count === "全問" ? filteredQuestions.length : Number.parseInt(count as string)
    const selectedQuestions = filteredQuestions.slice(0, questionCount)

    setQuestions(selectedQuestions)
    setUserAnswers(new Array(selectedQuestions.length).fill(null))

    // ローカルストレージからチェック済み問題と間違い問題を読み込み
    const savedChecked = localStorage.getItem("checkedQuestions")
    const savedWrong = localStorage.getItem("wrongQuestions")

    if (savedChecked) {
      setCheckedQuestions(new Set(JSON.parse(savedChecked)))
    }
    if (savedWrong) {
      setWrongQuestions(new Set(JSON.parse(savedWrong)))
    }
  }, [category, count, mode])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuestionIndex] = selectedAnswer
    setUserAnswers(newUserAnswers)

    // 間違い問題の管理
    if (selectedAnswer !== currentQuestion.correctAnswer) {
      const newWrongQuestions = new Set(wrongQuestions)
      newWrongQuestions.add(currentQuestion.id)
      setWrongQuestions(newWrongQuestions)
      localStorage.setItem("wrongQuestions", JSON.stringify(Array.from(newWrongQuestions)))
    } else {
      // 正解した場合は間違い問題リストから削除
      const newWrongQuestions = new Set(wrongQuestions)
      newWrongQuestions.delete(currentQuestion.id)
      setWrongQuestions(newWrongQuestions)
      localStorage.setItem("wrongQuestions", JSON.stringify(Array.from(newWrongQuestions)))
    }

    setShowResult(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      // 全問題完了 - 結果画面へ
      handleFinishQuiz()
    }
  }

  const handleFinishQuiz = () => {
    // 学習進捗を保存
    const correctCount = userAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length

    const savedProgress = localStorage.getItem("aromaQuizProgress")
    const currentProgress = savedProgress
      ? JSON.parse(savedProgress)
      : {
          totalQuestionsAnswered: 0,
          correctAnswers: 0,
          categoryProgress: {},
          studyStreak: 0,
          lastStudyDate: "",
        }

    const today = new Date().toISOString().split("T")[0]
    const newProgress = {
      ...currentProgress,
      totalQuestionsAnswered: currentProgress.totalQuestionsAnswered + questions.length,
      correctAnswers: currentProgress.correctAnswers + correctCount,
      lastStudyDate: today,
      studyStreak:
        currentProgress.lastStudyDate === today
          ? currentProgress.studyStreak
          : currentProgress.lastStudyDate === new Date(Date.now() - 86400000).toISOString().split("T")[0]
            ? currentProgress.studyStreak + 1
            : 1,
    }

    localStorage.setItem("aromaQuizProgress", JSON.stringify(newProgress))

    // 結果画面へリダイレクト（実装予定）
    alert(
      `学習完了！\n正解数: ${correctCount}/${questions.length}\n正答率: ${Math.round((correctCount / questions.length) * 100)}%`,
    )
  }

  const toggleBookmark = () => {
    const newCheckedQuestions = new Set(checkedQuestions)
    if (checkedQuestions.has(currentQuestion.id)) {
      newCheckedQuestions.delete(currentQuestion.id)
    } else {
      newCheckedQuestions.add(currentQuestion.id)
    }
    setCheckedQuestions(newCheckedQuestions)
    localStorage.setItem("checkedQuestions", JSON.stringify(Array.from(newCheckedQuestions)))
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">問題を読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <Link href="/quiz">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="text-center">
            <div className="text-sm text-gray-600">{category}</div>
            <div className="font-semibold text-green-800">
              {currentQuestionIndex + 1} / {questions.length}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleBookmark}
            className={checkedQuestions.has(currentQuestion.id) ? "text-blue-600" : "text-gray-400"}
          >
            {checkedQuestions.has(currentQuestion.id) ? (
              <BookmarkCheck className="h-5 w-5" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>進捗</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Question */}
        <Card className="border-green-200">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {currentQuestion.difficulty === "basic"
                  ? "基礎"
                  : currentQuestion.difficulty === "intermediate"
                    ? "標準"
                    : "応用"}
              </Badge>
              {wrongQuestions.has(currentQuestion.id) && (
                <Badge variant="destructive" className="text-xs">
                  間違い問題
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg leading-relaxed">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className={`w-full justify-start h-auto p-4 text-left whitespace-normal ${
                  showResult
                    ? index === currentQuestion.correctAnswer
                      ? "bg-green-100 border-green-500 text-green-800"
                      : selectedAnswer === index && index !== currentQuestion.correctAnswer
                        ? "bg-red-100 border-red-500 text-red-800"
                        : "opacity-60"
                    : selectedAnswer === index
                      ? "bg-green-600 hover:bg-green-700"
                      : "border-green-200 hover:bg-green-50"
                }`}
                onClick={() => !showResult && handleAnswerSelect(index)}
                disabled={showResult}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                      showResult && index === currentQuestion.correctAnswer
                        ? "bg-green-500 border-green-500 text-white"
                        : showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer
                          ? "bg-red-500 border-red-500 text-white"
                          : selectedAnswer === index
                            ? "bg-white text-green-600"
                            : "border-gray-300"
                    }`}
                  >
                    {showResult && index === currentQuestion.correctAnswer ? (
                      <Check className="h-3 w-3" />
                    ) : showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer ? (
                      <X className="h-3 w-3" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Explanation Dialog */}
        {showResult && (
          <Dialog open={showExplanation} onOpenChange={setShowExplanation}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-12 text-lg font-semibold border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <HelpCircle className="h-5 w-5 mr-2" />
                解説を見る
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-4 max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg text-blue-800 flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  解説
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-gray-700">{currentQuestion.explanation}</p>
                {currentQuestion.tags && currentQuestion.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {currentQuestion.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Action Buttons */}
        <div className="pt-4">
          {!showResult ? (
            <Button
              className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700"
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
            >
              解答する
            </Button>
          ) : (
            <Button
              className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700"
              onClick={handleNextQuestion}
            >
              {currentQuestionIndex < questions.length - 1 ? "次の問題" : "学習完了"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
