import { Popover } from "radix-ui";

function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline"> Hello world! </h1>
      <Popover.Root>
        <Popover.Trigger>More info</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            Some more info…
            <Popover.Arrow />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
}

export default App;
