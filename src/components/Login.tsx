import React from 'react';

interface Credentials {
  email: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = React.useState<Credentials>({
    email: '',
    password: '',
  });

  const { email, password }: Credentials = formData;

  // TODO: move this to a netlify function
  const emailAddresses: Array<string> | undefined = (process.env.REACT_APP_AUTHORIZED_USERS)?.split(',');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <>
      <h1 className="heading text-5xl">: hello</h1>
      <form onSubmit={(e): void => {
        e.preventDefault();
        if (emailAddresses && emailAddresses.includes(email) && password === 'password') {
          // TODO: actually do something with login credentials --> hook up to Fauna via netlify functions... move the above outta here
          console.log('Authorized. Please proceed.');
        } else {
          console.log('Nope');
        }
      }}>
        <input type="email" name="email" placeholder="Email" value={email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={password} onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;