import { $, component$, useSignal } from "@builder.io/qwik";
import { auth0Config } from '../../config/auth';
import { useNavigate } from "@builder.io/qwik-city";

const Signup = component$(() => {
    const email = useSignal('');
    const password = useSignal('');
    const navigate = useNavigate();

    const handleLogin = $(async () => {
        const response = await fetch(`https://${auth0Config.domain}/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              grant_type: 'password',
              username: email.value,
              password: password.value,
              client_id: auth0Config.clientId,
              scope: 'openid profile email'
            })
          });
      
          if (response.ok) {
            const data = await response.json();
            // Store the token securely (e.g., in localStorage)
            localStorage.setItem('auth_token', data.access_token);
            navigate('/home');
          } else {
            console.error('Login failed');
            // Handle login error (e.g., show error message to user)
          }
    })

    const handleSignUp = $(async () => {
        try {
            const signupResponse = await fetch(`https://${auth0Config.domain}/dbconnections/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: auth0Config.clientId,
                    email: email.value,
                    password: password.value,
                    connection: 'Username-Password-Authentication'
                })
            });

            const signupData = await signupResponse.json();

            if (signupResponse.ok) {
                console.log('Signup successful');
                // Signup successful, now log the user in
                await handleLogin();
            } else {
                // errorMessage.value = signupData.error_description || 'Signup failed';
                console.error('Signup failed:', signupData);
            }
        } catch (error) {
            // errorMessage.value = 'An error occurred during signup';
            console.error('Signup error:', error);
        }
    })
    return (
        <div>
          <h2>SignUp</h2>
          <div>
            <label for="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email.value}
              onChange$={(e) => email.value = (e.target as HTMLInputElement).value}
              required
            />
          </div>
          <div>
            <label for="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password.value}
              onChange$={(e) => password.value = (e.target as HTMLInputElement).value}
              required
            />
          </div>
          <button id="login-button" onClick$={handleSignUp}>SignUp</button>
        </div>

    )
})

export default Signup;