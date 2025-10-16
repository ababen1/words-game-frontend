interface LetterProps {
  text: string;
  size?: number;
  isActive: boolean;
  onMouseDown: () => void;
  onMouseEnter: () => void;
}

const colors = {
  activeColor: "#4CAF50",
  inactiveColor: "grey",
};

export const Letter: React.FC<LetterProps> = ({
  text,
  isActive,
  size = 50,
  onMouseEnter,
  onMouseDown,
}) => {
  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    backgroundColor: isActive ? colors.activeColor : colors.inactiveColor,
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: size / 2.5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "background 0.3s",
  };

  return (
    <button style={style} onMouseEnter={onMouseEnter} onMouseDown={onMouseDown}>
      {text}
    </button>
  );
};

export default Letter;
