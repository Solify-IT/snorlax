import React, { useEffect } from 'react';
import useNavigation from 'src/hooks/navigation';

const RegisterForm: React.FC = () => {
  const { setTitles } = useNavigation();

  useEffect(() => {
    setTitles({ title: 'Añadir libros' });
  }, []);

  return (
    <>Aquí iría el formulario</>
  );
};

export default RegisterForm;
