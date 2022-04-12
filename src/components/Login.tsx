import React from 'react';
import { Link } from 'react-router-dom';
import { LoginUser } from '../../functions/types/authTypes';

const Login = (): JSX.Element => {
  const [formData, setFormData] = React.useState<LoginUser>({
    email: '',
    password: '',
  });

  const { email, password }: LoginUser = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleForm = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <h1 className="heading text-5xl">: welcome back</h1>
      <form onSubmit={handleForm}>
        <input type="email" name="email" placeholder="Email" value={email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={password} onChange={handleChange} />
        <button type="submit">Login</button> or <Link to="/signup">Sign Up</Link>
      </form>
    </>
  );
};

export default Login;
