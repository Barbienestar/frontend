import { Button } from "./components/Button/button";
import Logo from "./assets/Logo.svg";
import InputField from "./components/Input/inputField";

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button variant={"default"}>Click me</Button>
      <InputField />
      <img src={Logo} alt="Logo" />
    </div>
  );
}

export default App;
