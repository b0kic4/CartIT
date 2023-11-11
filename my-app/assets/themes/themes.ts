export type Theme = {
  primary: string;
  background: string;
  textColor: string;
  darkMode: boolean;
};

export const lightTheme: Theme = {
  primary: "#3498db",
  background: "#ecf0f1",
  textColor: "#2c3e50",
  darkMode: false,
};

export const darkTheme: Theme = {
  primary: "#3498db",
  background: "#2c3e50",
  textColor: "#ecf0f1",
  darkMode: true,
};
