export const successResponse = (res, data = null, meta = null, status = 200) => {
  const response = {
    success: true,
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  res.status(status).json(response);
};

export function checkUserExist(req) {
    const currentUser = req.user;
    if (!currentUser) {
        throw new AppError('token info missing', 401);
    }
    return currentUser
}