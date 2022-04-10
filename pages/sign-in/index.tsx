import React, { FormEvent, useCallback, useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "#api/credentials";
import { CurrentUser } from "#components/contexts/CurrentUser";

import styles from "./styles.module.css";

export default function SignIn() {
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

      const { response, responseBody } = await signIn({ login, password });
      if (response.status == 200) {
        userContext.setUser(responseBody);
        router.push("/books");
      } else {
        if (response.status === 400) {
          alert("Credentials entered are incorrect");
        } else {
          alert("Error occured while calling backend API");
        }
      }
    },
    [login, router, password, userContext]
  );

  return (
    <form className={styles["sign-in"]} onSubmit={handleFormSubmit}>
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
      <input type="submit" value="Sign In" />
      <div className={styles["sign-up"]}>
        If you don`t have an account you may{" "}
        <Link href="/sign-up">sign up</Link>
      </div>
    </form>
  );
}
