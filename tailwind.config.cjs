/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                background: "#EEE3CB",
                primary: "#967E76",
                secondary: "#D7C0AE",
            },
        },
    },
    plugins: [],
};
