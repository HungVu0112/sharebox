import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blackColor: "var(--black-color)",
        lightBlackColor: "var(--light-black-color)",
        textGrayColor1: "var(--text-gray-color-1)",
        textGrayColor2: "var(--text-gray-color-2)",
        textHeadingColor: "var(--text-heading-color)",
        lineColor: "var(--line-color)",
        boxBackground: "var(--box-background)",
        lightWhiteColor: "var(--light-white-color)",
        
        mainColor: "var(--main-color)",
        buttonColor: "var(--button-color)",
        lightButtonColor: "var(--light-button-color)",
        inputBorderColor: "var(--input-border-color)",
        warningColor: "var(--warning-color)",
        warningMessageBackground: "var(--warning-message-background)",
        imageBackground: "var(--image-backround)",
        onlineColor: "var(--online-color)",
        voteDownColor: "var(--vote-down-color)",
      },
    },
  },
  plugins: [],
};
export default config;
