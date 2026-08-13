const isProduction = process.env.NODE_ENV === 'production';

const sendError = (res, status, message, error) => {
  if (error) {
    console.error(message, error);
  }

  return res.status(status).json({
    message,
    ...(isProduction ? {} : { error: error?.message }),
  });
};

const sendServerError = (res, error) => sendError(res, 500, 'Server error', error);

module.exports = { sendError, sendServerError, isProduction };
