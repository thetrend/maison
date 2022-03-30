export default function messageHelper(message: string, code: number = 200) {
  return {
    statusCode: code,
    body: JSON.stringify({
      message
    })
  }
};
