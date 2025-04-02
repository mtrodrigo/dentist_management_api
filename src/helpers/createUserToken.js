import jwt from 'jsonwebtoken';

export const createUserToken = async (user, req, res) => {

  const token = jwt.sign({
    name: user.name,
    id: user._id
  }, 'r2o7d0r4i8g5o')

  res.status(200).json({message: 'Autenticado com sucesso',
    token: token,
    userId: user._id
  })
}
   