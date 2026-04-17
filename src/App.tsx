import { Button } from "./components/Button/button";
import Logo from "./assets/Logo.svg";

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button variant={"default"}>Click me</Button>
      <img src={Logo} alt="Logo" />
    </div>
  );
}

export default App;
