const Input = ({ type, placeholder, id, value, onChange }) => {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        id={id}
        className="border-2 border-black rounded-lg p-2 w-full focus:outline-none focus:border-none focus:ring-2 focus:ring-pink-500"
        value={value}
        onChange={onChange}
        autoComplete="off"
      />
    </div>
  );
};

export default Input;
