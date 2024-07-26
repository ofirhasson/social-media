import { LoginForm } from "../../../FormsArea/LoginForm/LoginForm";
import "./Login.css";

export function Login(): JSX.Element {
  return (
    <div className="flex flex-col h-full m-auto md768:6/12 lg:w-130 justify-center">
      <LoginForm />
    </div>
  );
}
