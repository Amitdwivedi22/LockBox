const Card = ({ children, className = '' }) => {
  return (
    <div className={`security-card ${className}`}>
      {children}
    </div>
  );
};

export default Card;
