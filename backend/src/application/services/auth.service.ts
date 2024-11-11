import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { EntityManager } from 'typeorm';
import { SECRET_KEY } from '@/infrastructure/config';
import { UserEntity } from '@/domain/entities/users.entity';
import { HttpException } from '@/infrastructure/exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@/domain/interfaces/auth.interface';
import { User } from '@/domain/interfaces/users.interface';

const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: user.id };
  const secretKey: string = SECRET_KEY;
  const expiresIn: number = 60 * 60 * 24;

  return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
export class AuthService {
  constructor(private cnx: EntityManager) {}

  public async signup(userData: User): Promise<User> {
    const findUser: User = await this.cnx.findOne(UserEntity, { where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = this.cnx.create(UserEntity, { ...userData, password: hashedPassword });
    await this.cnx.save(createUserData);
    return createUserData;
  }

  public async login(userData: User): Promise<{ cookie: string; findUser: User }> {
    const findUser: User = await this.cnx.findOne(UserEntity, { where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password not matching');

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await this.cnx.findOne(UserEntity, { where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
}
