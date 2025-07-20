"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Trash2, Download, Moon, Sun } from "lucide-react"
import Link from "next/link"

interface UserSettings {
  fontSize: "small" | "medium" | "large"
  darkMode: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    fontSize: "medium",
    darkMode: false,
  })

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const savedSettings = localStorage.getItem("aromaQuizSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    localStorage.setItem("aromaQuizSettings", JSON.stringify(updatedSettings))
  }

  const handleDeleteAllData = () => {
    if (showDeleteConfirm) {
      localStorage.removeItem("aromaQuizProgress")
      localStorage.removeItem("wrongQuestions")
      localStorage.removeItem("checkedQuestions")
      localStorage.removeItem("aromaQuizSettings")
      setShowDeleteConfirm(false)
      alert("すべてのデータを削除しました。")
    } else {
      setShowDeleteConfirm(true)
    }
  }

  const handleExportData = () => {
    const progress = localStorage.getItem("aromaQuizProgress")
    const wrongQuestions = localStorage.getItem("wrongQuestions")
    const checkedQuestions = localStorage.getItem("checkedQuestions")
    const userSettings = localStorage.getItem("aromaQuizSettings")

    const exportData = {
      progress: progress ? JSON.parse(progress) : null,
      wrongQuestions: wrongQuestions ? JSON.parse(wrongQuestions) : [],
      checkedQuestions: checkedQuestions ? JSON.parse(checkedQuestions) : [],
      settings: userSettings ? JSON.parse(userSettings) : null,
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `aroma-quiz-backup-${new Date().toISOString().split("T")[0]}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

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
            <h1 className="text-xl font-bold text-green-800">設定</h1>
            <p className="text-sm text-gray-600">アプリの設定とデータ管理</p>
          </div>
        </div>

        {/* Display Settings */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-lg text-green-800">表示設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Font Size */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">フォントサイズ</Label>
              <div className="grid grid-cols-3 gap-2">
                {["small", "medium", "large"].map((size) => (
                  <Button
                    key={size}
                    variant={settings.fontSize === size ? "default" : "outline"}
                    className={`h-10 ${
                      settings.fontSize === size
                        ? "bg-green-600 hover:bg-green-700"
                        : "border-green-200 hover:bg-green-50"
                    }`}
                    onClick={() => updateSettings({ fontSize: size as "small" | "medium" | "large" })}
                  >
                    {size === "small" ? "小" : size === "medium" ? "中" : "大"}
                  </Button>
                ))}
              </div>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.darkMode ? (
                  <Moon className="h-5 w-5 text-gray-600" />
                ) : (
                  <Sun className="h-5 w-5 text-yellow-500" />
                )}
                <Label htmlFor="dark-mode" className="text-sm font-medium">
                  ダークモード
                </Label>
              </div>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => updateSettings({ darkMode: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-lg text-green-800">データ管理</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Export Data */}
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 border-green-200 hover:bg-green-50"
              onClick={handleExportData}
            >
              <Download className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium">データをエクスポート</div>
                <div className="text-xs text-gray-500">学習データをバックアップ</div>
              </div>
            </Button>

            {/* Delete All Data */}
            <Button
              variant="outline"
              className={`w-full justify-start gap-3 h-12 ${
                showDeleteConfirm
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-red-200 hover:bg-red-50 text-red-600"
              }`}
              onClick={handleDeleteAllData}
            >
              <Trash2 className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">{showDeleteConfirm ? "本当に削除しますか？" : "すべてのデータを削除"}</div>
                <div className="text-xs opacity-70">
                  {showDeleteConfirm ? "もう一度タップで実行" : "学習進捗・設定をリセット"}
                </div>
              </div>
            </Button>

            {showDeleteConfirm && (
              <Button variant="ghost" className="w-full text-gray-600" onClick={() => setShowDeleteConfirm(false)}>
                キャンセル
              </Button>
            )}
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="border-gray-200">
          <CardContent className="p-4 text-center text-sm text-gray-500">
            <div>AromaQuiz Pro v1.0.0</div>
            <div className="mt-1">AEAJ アロマテラピーインストラクター試験対策</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
