import { SFCScriptBlock } from '@vue/compiler-sfc';
import { BG_RESET, BG_WARN, TEXT_WARN, TEXT_RESET, TEXT_INFO } from '../asceeCodes'

const functionSizeFiles: { filename: string, funcName: string }[] = [];

const MAX_FUNCTION_LENGTH = 20 // completely rrd made-up number

const checkFunctionSize = (script: SFCScriptBlock, filePath: string) => {
  // Regular expression to match function definitions (both regular and arrow functions)
  const regex = /function\s+([a-zA-Z0-9_$]+)\s*\([^)]*\)\s*{([^{}]*(([^{}]*{[^{}]*}[^{}]*)*[^{}]*))}|const\s+([a-zA-Z0-9_$]+)\s*=\s*\([^)]*\)\s*=>\s*{([^{}]*(([^{}]*{[^{}]*}[^{}]*)*[^{}]*))}/g;
  let match;

  while ((match = regex.exec(script.content)) !== null) {
    /*
      We use match[1] and match[2] for regular functions
      and match[5] and match[6] for arrow functions
    */
    const funcName = match[1] || match[5]; 
    const funcBody = match[2] || match[6];
    
    // Check if the function block has more than `MAX_FUNCTION_LENGTH` lines
    const lineCount = funcBody.split('\n').length;
    if (lineCount > MAX_FUNCTION_LENGTH) {
      functionSizeFiles.push({ filename: filePath, funcName });
    }
  }
}

const reportFunctionSize = () => {
  if (functionSizeFiles.length > 0) {
    console.log(
      `\n${TEXT_INFO}rrd${TEXT_RESET} ${BG_WARN}function size${BG_RESET} exceeds recommended limit in ${functionSizeFiles.length} files.`
    )
    console.log(`👉 ${TEXT_WARN}Functions must be shorter than ${MAX_FUNCTION_LENGTH} lines${TEXT_RESET}`)
    functionSizeFiles.forEach(file => {
      console.log(`- ${file.filename} 🚨 ${BG_WARN}(${file.funcName})${BG_RESET}`)
    })
  }
  return functionSizeFiles.length
}

export { checkFunctionSize, reportFunctionSize };
