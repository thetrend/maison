export default message = (message: string, code: number = 200) => {
  return {
    statusCode: code,
    body: JSON.stringify({
      message
    })
  }
};
