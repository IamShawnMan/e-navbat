export const successRes = (res, code, resData) => {
  return res.status(code).json({
    statusCode: code,
    message: 'success',
    data: resData,
  });
};
