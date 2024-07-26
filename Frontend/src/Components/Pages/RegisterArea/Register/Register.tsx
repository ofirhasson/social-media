import { RegisterForm } from "../../../FormsArea/RegisterForm/RegisterForm";
import "./Register.css";

export function Register(): JSX.Element {
    return (
        <div className="flex flex-col h-full m-auto md768:6/12 lg:w-130 justify-center">
			<RegisterForm/>
        </div>
    );
}
