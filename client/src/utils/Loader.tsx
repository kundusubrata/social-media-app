import { LoaderCircle } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <LoaderCircle className="animate-spin text-4xl text-blue-500" />
    </div>
  );
};

export default Loader;
