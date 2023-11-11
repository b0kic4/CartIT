export type Theme = {
  primary: string;
  background: string;
  textColor: string;
  darkMode: boolean;
};

export const lightTheme: Theme = {
  primary: "#F5F5F5",
  background: "#ecf0f1",
  textColor: "#2c3e50",
  darkMode: false,
};

export const darkTheme: Theme = {
  primary: "#124466",
  background: "#2c3e50",
  textColor: "#000000",
  darkMode: true,
};
