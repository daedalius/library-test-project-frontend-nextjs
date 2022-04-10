import React, { FormEvent, useCallback, useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signUp } from "#api/credentials";
import { CurrentUser } from "#components/contexts/CurrentUser";

import styles from "./styles.module.css";

export default function SignUp() {
  const router = useRouter();
  const userContext = useContext(CurrentUser);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginChange = useCallback((e) => {
    setLogin(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleFormSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const { response, responseBody } = await signUp({
        login,
        password,
      });
      if (response.status == 200) {
        userContext.setUser(responseBody);
        router.push("/books");
      } else {
        if (response.status === 400) {
          alert("Unable to register user with that login/password pair");
        } else {
          alert("Error occured while calling backend API");
        }
      }
    },
    [login, router, password, userContext]
  );

  return (
    <form className={styles["sign-up"]} onSubmit={handleFormSubmit}>
      <label htmlFor="login">Login: </label>
      <input
        type="text"
        id="login"
        value={login}
        onChange={handleLoginChange}
      />
      <label htmlFor="password">Password: </label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={handlePasswordChange}
      />
      <input type="submit" value="Sign Up" />
      <div className={styles["sign-up__sign-in"]}>
        If you already have an account you may{" "}
        <Link href="/sign-in">sign in</Link>
      </div>
    </form>
  );
}
