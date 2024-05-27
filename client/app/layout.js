import "@/style/global.scss";
import 'rodal/lib/rodal.css';
import 'aos/dist/aos.css';

export const metadata = {
  title: "Shaxzoda's Online Course",
  description: "Online course of SMM and Business ...",
  icons: {
    icon: 'favicon.ico',
    apple: 'logo.png',
    shortcut: 'logo.png',
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
