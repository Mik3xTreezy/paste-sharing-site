// Simple language detection based on file extensions and content patterns
export function detectLanguage(content: string, filename?: string): string {
  // Check filename first
  if (filename) {
    const extension = filename.split('.').pop()?.toLowerCase()
    if (extension) {
      const languageMap: { [key: string]: string } = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'cs': 'csharp',
        'php': 'php',
        'rb': 'ruby',
        'go': 'go',
        'rs': 'rust',
        'swift': 'swift',
        'kt': 'kotlin',
        'scala': 'scala',
        'html': 'html',
        'css': 'css',
        'scss': 'scss',
        'sass': 'sass',
        'less': 'less',
        'json': 'json',
        'xml': 'xml',
        'yaml': 'yaml',
        'yml': 'yaml',
        'toml': 'toml',
        'ini': 'ini',
        'sh': 'bash',
        'bash': 'bash',
        'zsh': 'bash',
        'sql': 'sql',
        'md': 'markdown',
        'txt': 'text',
      }
      
      if (languageMap[extension]) {
        return languageMap[extension]
      }
    }
  }

  // Check content patterns
  const patterns: { [key: string]: RegExp[] } = {
    'javascript': [
      /function\s+\w+\s*\(/,
      /const\s+\w+\s*=/,
      /let\s+\w+\s*=/,
      /var\s+\w+\s*=/,
      /console\.log/,
      /import\s+.*\s+from/,
      /export\s+default/,
    ],
    'typescript': [
      /interface\s+\w+/,
      /type\s+\w+\s*=/,
      /:\s*\w+\[\]/,
      /:\s*Promise</,
    ],
    'python': [
      /def\s+\w+\s*\(/,
      /import\s+\w+/,
      /from\s+\w+\s+import/,
      /print\s*\(/,
      /if\s+__name__\s*==\s*['"]__main__['"]/,
    ],
    'java': [
      /public\s+class/,
      /public\s+static\s+void\s+main/,
      /System\.out\.println/,
      /import\s+java\./,
    ],
    'cpp': [
      /#include\s*</,
      /std::/,
      /cout\s*<</,
      /cin\s*>>/,
    ],
    'c': [
      /#include\s*</,
      /printf\s*\(/,
      /scanf\s*\(/,
      /int\s+main\s*\(/,
    ],
    'php': [
      /<\?php/,
      /echo\s+/,
      /function\s+\w+\s*\(/,
      /\$\w+/,
    ],
    'html': [
      /<!DOCTYPE\s+html>/,
      /<html/,
      /<head/,
      /<body/,
      /<div/,
    ],
    'css': [
      /\{[^}]*\}/,
      /:\s*[^;]+;/,
      /@media/,
      /@keyframes/,
    ],
    'sql': [
      /SELECT\s+.+FROM/i,
      /INSERT\s+INTO/i,
      /UPDATE\s+.+SET/i,
      /DELETE\s+FROM/i,
      /CREATE\s+TABLE/i,
    ],
    'bash': [
      /#!/,
      /echo\s+/,
      /if\s+\[/,
      /for\s+\w+\s+in/,
      /while\s+\[/,
    ],
    'markdown': [
      /^#\s+/m,
      /^##\s+/m,
      /^###\s+/m,
      /\[.*\]\(.*\)/,
      /^\*\s+/m,
    ],
  }

  // Count matches for each language
  const scores: { [key: string]: number } = {}
  
  for (const [language, regexes] of Object.entries(patterns)) {
    scores[language] = 0
    for (const regex of regexes) {
      if (regex.test(content)) {
        scores[language]++
      }
    }
  }

  // Find the language with the highest score
  let bestLanguage = 'text'
  let bestScore = 0

  for (const [language, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score
      bestLanguage = language
    }
  }

  // Only return a specific language if we have a reasonable confidence
  return bestScore >= 2 ? bestLanguage : 'text'
} 