import * as jwt from 'jsonwebtoken';
import { bcrypt } from '@brainhubeu/hadron-auth';

const secret = process.env.JWT_SECRET || 'H4DR0N_S3CUR17Y';

const unauthorized = {
  status: 403,
  body: {
    error: {
      message: 'Unauthorized',
    },
  },
};

const login = async (req: any, { userRepository }) => {
  try {
    const user = await userRepository.findOne({
      where: { username: req.body.username },
    });

    if (!user) {
      return unauthorized;
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.passwordHash,
    );

    if (validPassword) {
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        secret,
        {
          expiresIn: '2h',
        },
      );

      return {
        status: 200,
        body: {
          token,
        },
      };
    }
    return unauthorized;
  } catch (error) {
    return unauthorized;
  }
};

export default login;
