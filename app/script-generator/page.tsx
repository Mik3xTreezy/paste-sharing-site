"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Code, CheckCircle, AlertCircle, ArrowLeft, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ScriptGeneratorPage() {
  const [selectionType, setSelectionType] = useState<"include" | "exclude">("include")
  const [domains, setDomains] = useState("")
  const [generatedScript, setGeneratedScript] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const generateScript = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/script-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectionType,
          domains: domains.split('\n').filter(d => d.trim()).map(d => d.trim()),
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setGeneratedScript(data.script)
      } else {
        console.error('Failed to generate script:', data.error)
      }
    } catch (error) {
      console.error('Error generating script:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyScript = async () => {
    if (generatedScript) {
      await navigator.clipboard.writeText(generatedScript)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 p-0.5">
                  <div className="w-full h-full bg-black rounded-md flex items-center justify-center">
                    <Code className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
                  Full Page Script Generator
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Full Page Script Code Generator</h2>
          <p className="text-gray-400 text-lg">
            If you have a website with 100's or 1000's of paste links you want to change over to PasteScript then please use the script below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Script Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Domain Selection Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Domains selection type
                </label>
                <Select value={selectionType} onValueChange={(value: "include" | "exclude") => setSelectionType(value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="include">Include</SelectItem>
                    <SelectItem value="exclude">Exclude</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2 space-y-1 text-sm text-gray-400">
                  <p><strong>Include:</strong> Use this option if you want to convert only links from the following domains list.</p>
                  <p><strong>Exclude:</strong> Use this option if you wish to convert every paste link on your website but exclude only the links from the following domains list.</p>
                </div>
              </div>

              {/* Domains Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Domains
                </label>
                <Textarea
                  placeholder="pastebin.com&#10;*.hastebin.com&#10;dpaste.com&#10;gist.github.com&#10;paste.ubuntu.com"
                  value={domains}
                  onChange={(e) => setDomains(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[120px]"
                />
                <div className="mt-2 text-sm text-gray-400">
                  <p>Add each domain into a new line. Wildcard domains are supported. Common paste services:</p>
                  <div className="mt-1 font-mono text-xs bg-gray-800 p-2 rounded">
                    pastebin.com<br />
                    *.hastebin.com<br />
                    dpaste.com<br />
                    gist.github.com<br />
                    paste.ubuntu.com
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateScript}
                disabled={isGenerating || !domains.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  "Generate"
                )}
              </Button>

              <Alert className="bg-blue-900/20 border-blue-500/20">
                <Info className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-blue-300">
                  Simply click on the Generate button then copy-and-paste the generated code below on to your webpage or blog and the links will be updated automatically!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Generated Script Panel */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Generated Script
                {generatedScript && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyScript}
                    className="border-gray-700 hover:bg-gray-800"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedScript ? (
                <div className="relative">
                  <pre className="bg-gray-800 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto max-h-96 overflow-y-auto">
                    <code>{generatedScript}</code>
                  </pre>
                </div>
              ) : (
                <div className="bg-gray-800 p-8 rounded-lg text-center">
                  <Code className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Configure your settings and click Generate to create your custom script</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        {generatedScript && (
          <Card className="mt-8 bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">1</div>
                  <p>Copy the generated JavaScript code above</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">2</div>
                  <p>Paste it into your website's HTML, preferably before the closing &lt;/body&gt; tag</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">3</div>
                  <p>The script will automatically detect and convert paste links from the specified domains to PasteScript links</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">4</div>
                  <p>Users clicking on these links will be redirected to PasteScript with the original content</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
