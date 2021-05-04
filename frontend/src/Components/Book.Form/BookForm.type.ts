import { FormInstance } from 'antd';
import { BookFormType } from 'src/@types';

export default interface Props {
  initialState: BookFormType;
  onFinish: (values: any) => void;
  onFinishFailed: (values: any) => void;
  onISBNChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  form: FormInstance<any>;
  isLoading: boolean;
  isManualInsert: boolean;
}
