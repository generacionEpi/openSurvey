import PropTypes from 'prop-types';
import React, { useState } from 'react';

async function loginUser(credentials) {
    return fetch('http://192.168.10.102:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }
const Login = ({setToken}) => {

  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [warnings, setWarnings] = useState([]);

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password
    });
    if(token.status){
        setToken(token);
       
   
        console.log("This is the right information")

    }else{

        setWarnings([{message: "Incorrect Username or Password",type:"alert alert-danger alert-flush"}])
        console.error("This is the wrong information", warnings)
    }
  }
    return (
        <div className="text-center container">

            {warnings.map((warning)=>( <div className={warning.type} role="alert">
    <strong>Heads up!</strong> {warning.message}
        </div>))}

<main class="form-signin">
  <form onSubmit={handleSubmit}>
    <img class="mb-4" src="/docs/5.0/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57" />
    <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

    <div class="form-floating">
      <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" onChange={e => setUserName(e.target.value)} />
      <label for="floatingInput">Email address</label>
    </div>
    <div class="form-floating">
      <input type="password" class="form-control" id="floatingPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <label for="floatingPassword">Password</label>
    </div>

    <div class="checkbox mb-3">
      <label>
        <input type="checkbox" value="remember-me" /> Remember me
      </label>
    </div>
    <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
    <p class="mt-5 mb-3 text-muted">© 2017–2021</p>
  </form>
</main>

</div>          
    )
}
Login.propTypes = {
    setToken: PropTypes.func.isRequired
  }
export default Login