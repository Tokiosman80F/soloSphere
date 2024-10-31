const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="spin">
        <button
          type="button"
          className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded inline-flex items-center"
          disabled
        >
          <svg
            className="animate-spin h-5 w-5 mr-3 text-white"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          Processing...
        </button>
      </div>
    </div>
  );
};

export default LoadingSpinner;
