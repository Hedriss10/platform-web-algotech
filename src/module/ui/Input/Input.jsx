/**
 * A generic input component.
 *
 * @param {string} id - The id of the input component.
 * @param {string} type - The type of the input component.
 * @param {string} label - The label of the input component.
 * @param {any} value - The value of the input component.
 * @param {function} onChange - The on change event of the input component.
 * @param {string} placeholder - The placeholder of the input component.
 * @param {boolean} required - Whether the input component is required.
 * @param {string} error - The error message of the input component.
 *
 * @returns {React.ReactElement} - The Input component.
 */
const Input = ({
  id,
  type,
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  ...props
}) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-900">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition-all duration-200 ${
        error ? "border-red-600" : "border-gray-300"
      } bg-white text-gray-900 placeholder-gray-400 sm:px-4 sm:py-2`}
      placeholder={placeholder}
      aria-label={label}
      {...props}
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

export default Input;
