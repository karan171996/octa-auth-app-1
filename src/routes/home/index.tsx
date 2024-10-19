import { component$,$ } from "@builder.io/qwik";
import { auth0Client } from "../index";

const Home = component$(() => {

  const logoutHandler = $(() => {
    auth0Client.logout({ logoutParams: { returnTo: 'https://qwik.dummykarantest.online/' } });
  })
    return (
      <div>
        <h1>Logged In</h1>

        <button onClick$={logoutHandler}>Logout</button>
      </div>
    )
})

export default Home;