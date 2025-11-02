// example usage: devConsole.log("Hello, world!");
//  devConsole.error("An error occurred.");
//  devConsole.warn("This is a warning.");
//  devConsole.info("Some information.");

export const devConsole = {
  log: (message: unknown, ...optionalParams: unknown[]) => {
    if (import.meta.env.MODE === "development") {
      console.log(message, ...optionalParams);
    }
  },
  error: (message: unknown, ...optionalParams: unknown[]) => {
    if (import.meta.env.MODE === "development") {
      console.error(message, ...optionalParams);
    }
  },
  warn: (message: unknown, ...optionalParams: unknown[]) => {
    if (import.meta.env.MODE === "development") {
      console.warn(message, ...optionalParams);
    }
  },
  info: (message: unknown, ...optionalParams: unknown[]) => {
    if (import.meta.env.MODE === "development") {
      console.info(message, ...optionalParams);
    }
  },
};

export default devConsole;
