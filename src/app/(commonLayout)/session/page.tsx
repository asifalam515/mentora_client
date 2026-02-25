const Session = async () => {
  // try to access session from auth context, if not available, fallback to server session
  return (
    <div>
      <h1>Session Page</h1>
    </div>
  );
};

export default Session;
