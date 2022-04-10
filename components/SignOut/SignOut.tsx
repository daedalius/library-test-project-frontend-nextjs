import { signOut } from "#api/credentials";
import React, { useCallback } from "react";

export function SignOut() {
  const handleButtonClick = useCallback(() => {
    (async () => {
      await signOut();
      document.location.href = "/sign-in";
    })();
  }, []);

  return <button onClick={handleButtonClick}>Sign Out</button>;
}
