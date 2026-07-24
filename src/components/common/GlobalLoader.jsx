import { Spinner } from "./Spinner";

export default function GlobalLoader() {
  // const { isLoading, loadingText } = useSelector((state) => state.loader);

  // if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
        <Spinner />
      </div>
    </div>
  );
}
