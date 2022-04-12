import { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { NewUser } from '../../functions/types/authTypes';
import { useAppState } from '../state/AppStateContext';
import { signup } from '../state/user/Actions';

const Signup = () => {
  const { user } = useAppState();
  const initialState: NewUser = {
    email: '',
    username: '',
    password: '',
    verifiedPassword: '',
  };
  
  const { email, username, password, verifiedPassword }: NewUser = initialState;

  // const handleChange = (e: ChangeEvent<HTMLInputElement>): void => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
  }

  return (
    <>
      <small>{user && user.token}</small><br />
      <h1 className="heading text-5xl">: hello</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={email} />
        <input type="username" name="username" placeholder="Username" value={username} />
        <input type="password" name="password" placeholder="Password" value={password} />
        <input type="password" name="verifiedPassword" placeholder="Verify Password" value={verifiedPassword} />
        <button type="submit">Sign Up</button> or <Link to="/">Login</Link>
      </form>
    </>
  );
};

export default Signup;
