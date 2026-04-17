
import { InformativeCard } from "./components/informative-card";
import { Button } from "./components/Button/button";

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button variant={"default"}>Click me</Button>
      <InformativeCard
        title="Informative Card"
        description="This is an informative card component."
        icon={<span>📘</span>}
        className="mt-4 w-64"
      />
    </div>
  );
}

export default App;
