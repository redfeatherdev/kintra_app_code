const Loader = () => {
  return (
    <div className="fixed top-0 left-0 z-9999 flex w-screen h-screen items-center justify-center bg-white">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
};

export default Loader;
