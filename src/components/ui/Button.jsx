const Button = ({ children, onClick, loading, disabled, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`security-button ${loading ? 'opacity-75 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
