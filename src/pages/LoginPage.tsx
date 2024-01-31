import React, { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import { useLogin } from "../api/login";
import { useAuth } from "../auth/auth";
import { LoginInput } from "../api/types";

export const Route = createFileRoute("/")({
  component: LoginComponent,
});

const queryClient = new QueryClient();

function LoginComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <Login />
    </QueryClientProvider>
  );
}

function Login() {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("")

  const login = useLogin();
  const mutation = useMutation({
    mutationFn: (user: LoginInput) => login(user),
    onError: () => {
      setIsSubmitting(false);
      setMessage("Email atau Password Salah")
    },
  });

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if(!isSubmitting) {
      setIsSubmitting(true);
      mutation.mutate({ email, password });
    }
  };

  if (mutation.isSuccess) {
    localStorage.setItem(
      "access_token",
      JSON.stringify(mutation.data.data.token)
    );
    setAuthUser(mutation.data.data);
    navigate({ to: "/dashboard/ticket" });
  }

  return (
    <>
      <div className="flex h-screen">
        <div className="w-9/12 bg-blue-400 flex flex-col items-center justify-center gap-4">
          <div className="w-3/12 h-3/6 bg-blue-500 rounded-lg"></div>
          <h1 className="text-lg text-white font-medium">Welcome!!</h1>
        </div>
        <div className="w-3/12 p-6 gap-4 flex flex-col">
          <h1 className="text-2xl font-semibold">Ticketing</h1>
          <p className="text-lg font-semibold">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <form className="w-full" onSubmit={handleSubmit}>
            <fieldset
              disabled={isSubmitting}
              className="w-full flex flex-col gap-4"
            >
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm bg-blue-400 border rounded-e-0 border-blue-400 rounded-s-md">
                  <svg
                    className="w-5 h-5 text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M2 5.6V18c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V5.6l-.9.7-7.9 6a2 2 0 0 1-2.4 0l-8-6-.8-.7Z" />
                    <path d="M20.7 4.1A2 2 0 0 0 20 4H4a2 2 0 0 0-.6.1l.7.6 7.9 6 7.9-6 .8-.6Z" />
                  </svg>
                </span>
                <input
                  type="email"
                  className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 outline-none placeholder:text-gray-500"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm bg-blue-400 border rounded-e-0 border-blue-400 rounded-s-md">
                    <svg
                      className="w-5 h-5 text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7c0-1.1.9-2 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6c.6 0 1 .4 1 1v3a1 1 0 1 1-2 0v-3c0-.6.4-1 1-1Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                  <input
                    type="password"
                    className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 outline-none placeholder:text-gray-500"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                </div>
                {mutation.isError ? <p className="text-sm text-red-500 italic">{message}</p> : null}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-400 text-white py-2 px-4 rounded-md font-medium"
              >
                {isSubmitting ? "Loading..." : "Login"}
              </button>
            </fieldset>
          </form>
          <div className="text-center text-sm">
            <p>
              Belum punya akun?
              <Link
                to="/register"
                className=" ml-1 font-semibold text-blue-400"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
