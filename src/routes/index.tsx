import { component$, useSignal, $, useVisibleTask$, useStore } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { auth0Config } from '../config/auth';
import { Auth0Client } from '@auth0/auth0-spa-js';


export const auth0Client = new Auth0Client({
  domain: auth0Config.domain,
  clientId: auth0Config.clientId,
  authorizationParams: auth0Config.authorizationParams,
});

export default component$(() => {
  const state = useStore({
    isAuthenticated: false,
    errorMessage: '',
    isPopupOpen: false,
  });
  const navigate = useNavigate();




  // const openLoginPopup = $(() => {
  //   const popupWidth = 400;
  //   const popupHeight = 600;
  //   const left = (window.innerWidth - popupWidth) / 2;
  //   const top = (window.innerHeight - popupHeight) / 2;

  //   const authUrl = `https://${auth0Config.domain}/authorize?` +
  //       `response_type=token&` +
  //       `client_id=${auth0Config.clientId}&` +
  //       `redirect_uri=${encodeURIComponent(auth0Config.authorizationParams.redirect_uri)}&` +
  //       `scope=${encodeURIComponent(auth0Config.scope)}`;

  //   const popup = window.open(
  //       authUrl,
  //       'Auth0 Login',
  //       `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`
  //   );

  //   if (popup) {
  //     state.isPopupOpen = true;
  //   } else {
  //     state.errorMessage = 'Unable to open login popup. Please disable your popup blocker.';
  //   }
  // });

  // const handleAuthMessage = $((event: MessageEvent) => {
  //   if (event.origin !== window.location.origin) return;

  //   if (event.data.type === 'AUTH_SUCCESS') {
  //     localStorage.setItem('auth_token', event.data.access_token);
  //     state.isAuthenticated = true;
  //     if (state.isPopupOpen) {
  //       state.isPopupOpen = false;
  //     }
  //     navigate('/home');
  //   } else if (event.data.type === 'AUTH_ERROR') {
  //     state.errorMessage = 'Login failed';
  //   }
  // });

  const loginHandler = $(async () => {

    await auth0Client.loginWithRedirect();
    const user = await auth0Client.getUser();
    console.log(user);
  });

  return (
    <div>
      {state.isAuthenticated ? (
        <div>
          <h2>Welcome!</h2>
          <p>You are logged in.</p>
          <button onClick$={() => {
            localStorage.removeItem('auth_token');
            state.isAuthenticated = false;
            navigate('/');
          }}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Please log in</h2>
         <button onClick$={loginHandler}>Login</button>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ]
};
