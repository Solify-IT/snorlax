import User, { StoredUser, UserInput } from 'src/@types/user';

export default interface Props {
  user: StoredUser ;
  isLoading:boolean;
}
