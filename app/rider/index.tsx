import { Href, Redirect } from "expo-router";

import { useContext } from "react";

// Context
import { AuthContext } from "@/lib/rider/context/global/auth.context";

// Constant
import { ROUTES } from "@/lib/rider/utils/constants";

function App() {
  const { token, isAuthReady } = useContext(AuthContext);

  if (!isAuthReady) {
    return <></>;
  }

  if (!token) {
    return <Redirect href={ROUTES.login as Href} />;
  }

  return <Redirect href={ROUTES.home as Href} />;
}

export default App;
