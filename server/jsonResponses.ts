export function createSuccessJson() {
  return {
    "isSuccess": true
  }
}

export function createFailureJson(msg) {
  return {
    "isSuccess": false,
    "error": msg
  }
}