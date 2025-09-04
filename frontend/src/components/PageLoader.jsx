import { useThemeStore } from "../store/useThemestore";

const PageLoader = () => {
  const { theme } = useThemeStore();

  return (
    <div
      className="min-h-screen flex items-center justify-center relative bg-base-100"
      data-theme={theme}
    >
      {/* Ripple Loader */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="ripple absolute w-full h-full rounded-full border-4 border-primary opacity-70"></div>
        <div className="ripple absolute w-full h-full rounded-full border-4 border-primary opacity-70 delay-500"></div>
        <div className="dot w-6 h-6 bg-primary rounded-full shadow-md"></div>
      </div>

      {/* Loading text */}
      <p className="absolute bottom-10 text-primary font-semibold tracking-wide">
        Loading...
      </p>

      <style>{`
        @keyframes ripple {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .ripple {
          animation: ripple 1.5s infinite;
        }
        .delay-500 {
          animation-delay: 0.75s;
        }
        .dot {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
