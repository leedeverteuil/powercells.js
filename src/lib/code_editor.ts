import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

const ampRegex = new RegExp("&", "g");
const leftBracketRegex = new RegExp("<", "g");
const rightBracketRegex = new RegExp(">", "g");
const AsyncFunction = async function () { }.constructor;

// register languages
hljs.registerLanguage('javascript', javascript);

export function preventTabbingOut(e: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  if (e.key == "Tab") {
    const target = e.currentTarget;
    e.preventDefault();

    const start = target.selectionStart;
    const end = target.selectionEnd;

    target.value = target.value.substring(0, start) + "  " + target.value.substring(end);
    target.selectionStart = target.selectionEnd = start + 2;

    return true;
  }

  return false;
}

export function getFunctionBody(func: Function | null) {
  const funcStr = func?.toString() ?? ""

  // remove top two lines and last line
  let lines = funcStr.split("\n");
  lines = lines.filter((_, i) => {
    return i !== 0 && i !== 1 && i !== lines.length - 1;
  });

  return lines.join("\n");
}

export function buildCalculateFunction(funcStr: string): Function {
  return AsyncFunction("value", "get", "set", "update", funcStr) as Function;
}

export function buildFormatFunction(funcStr: string): Function {
  return Function("value", funcStr) as Function;
}

export function buildActionFunction(funcStr: string): Function {
  return AsyncFunction("get", "set", "update", funcStr) as Function;
}

export function cleanCodeForInnerHTML(code: string) {
  code = code.replace(ampRegex, "&amp;").replace(leftBracketRegex, "&lt;").replace(rightBracketRegex, "&gt;");

  // last char newlines replace with space at end so it gets rendered
  if (code[code.length - 1] == "\n") {
    code += " ";
  }

  return code;
}
