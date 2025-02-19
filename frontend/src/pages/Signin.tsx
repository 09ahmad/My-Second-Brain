import { useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signin() {
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate();
  async function signin() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      const response = await axios.post(BACKEND_URL + "/api/v1/login", {
        username,
        password
      })
      const jwt = response.data.token;
      localStorage.setItem("token", jwt);
      navigate("/dashboard")
      // redirect the user to the dashboard
    } catch (error) {
      alert("Signup failed! check for details")
    }
  }

  return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
    <div className="bg-white rounded-xl border min-w-48 p-8 ">
      <Input reference={usernameRef} placeholder="email" />
      <Input reference={passwordRef} placeholder="Password" />
      <div className="flex justify-center pt-4">
        <Button onClick={signin} variant="primary" text="Signin" fullWidth={true} loading={false} />
      </div>
    </div>
  </div>
}

