export function createSuccessJson(msg = "") {
  return {
    "isSuccess": true,
    "message": msg
  }
}

export function createFailureJson(msg) {
  return {
    "isSuccess": false,
    "error": msg
  }
}