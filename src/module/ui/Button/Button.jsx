/**
 * A generic button component.
 *
 * @param {React.ReactNode} children - The content of the button.
 * @param {boolean} disabled - If the button is disabled.
 * @param {boolean} loading - If the button is in a loading state.
 * @param {string} className - Additional classes to be applied to the button.
 * @param {...Object} props - Other props to be passed to the button.
 *
 * @returns {React.ReactElement} - The Button component.
 */
const Button = ({ children, disabled, loading, className, ...props }) => (
  <button
    disabled={disabled || loading}
    className={`px-3 py-2 rounded-lg text-white font-semibold transition-all duration-200 ${
      loading
        ? "bg-blue-700 cursor-not-allowed opacity-70"
        : "bg-blue-600 hover:bg-blue-700"
    } ${className} sm:px-4 sm:py-2`}
    aria-label={children}
    {...props}
  >
    {loading ? "Carregando..." : children}
  </button>
);

export default Button;
