import React from 'react';
interface credentialType {
  email: string;
  password: string;
}

const Login = (): JSX.Element => {
  const [formData, setFormData] = React.useState<credentialType>({
    email: '',
    password: '',
  });

  const { email, password }: credentialType = formData;

  // TODO: move this to a netlify function
  const emailAddresses: Array<string> | undefined = (process.env.REACT_APP_AUTHORIZED_USERS)?.split(',');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (emailAddresses?.includes(email) && password === '123') {

    }
  };

  return (
    <>
      <h1 className="heading text-5xl">: hello</h1>
      <form onSubmit={handleForm}>
        <input type="email" name="email" placeholder="Email" value={email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={password} onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
