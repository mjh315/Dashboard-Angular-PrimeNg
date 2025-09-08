// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        // "./src/**/*.{html,ts}", // این خط برای اسکن فایل‌های HTML و TypeScript در پوشه src ضروری است.
        // "./src/app/**/*.{html,ts}", // این خط هم برای اطمینان از اسکن کامپوننت‌ها
        // // اگر PrimeNG و Tailwind PrimeUI را استفاده می‌کنید:
        // "./node_modules/primeng/**/*.{js,ts,html,css}",
        // "./node_modules/@primeng/themes/**/*.{js,ts,html,css}",
        // "./node_modules/primeflex/**/*.{js,ts,html,css}",
        // "./node_modules/primeicons/**/*.{js,ts,html,css}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        // require('tailwindcss-primeui'), // مطمئن شوید که این پلاگین اینجا هست
    ],
}