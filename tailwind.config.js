const BREAKPOINTS = {
  sm: 768,
  md: 992,
  lg: 1200,
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  corePlugins: {
    preflight: false,
  },
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      screens: {
        xs: {
          max: `${BREAKPOINTS.sm}px`,
        },
        sm: {
          max: `${BREAKPOINTS.md}px`,
        },
        md: {
          min: `${BREAKPOINTS.sm + 1}px`,
          max: `${BREAKPOINTS.lg}px`,
        },
        lg: {
          min: `${BREAKPOINTS.md + 1}px`,
        },
        xl: {
          min: `${BREAKPOINTS.lg + 1}px`,
        },
      },
    },
  },
  plugins: [],
};
