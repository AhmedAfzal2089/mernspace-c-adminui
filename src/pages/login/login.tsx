const LoginPage = () => {
  return (
    <>
      <h1>Sign in</h1>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <button>Log in</button>
      <label htmlFor="rememeber-me">Remember me</label>
      <input type="checkbox" id="rememeber-me" />
      <a href="#">Forgot password</a>
    </>
  );
};

export default LoginPage;
