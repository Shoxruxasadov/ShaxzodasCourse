import Link from "next/link";
import HomeLayout from '@/layout/home'

export default function Home() {
  return (
    <HomeLayout name='hero'>
      <div className="title">
        <h3>Assalomu alekum! Men</h3>
        <h1>Turdimurodova Shahzoda</h1>
        <h2>Biznes kurator</h2>
        <p>
          Cheteldan arzon mahsulotlarni buyurtma qilish,
          uydan turib onlayn shop yuritish,
          Instagram orqali daromad,
          instagram rivojlantirish bo'yicha tajribaga ega kuratorman.
        </p>
        <Link href="https://t.me/shahzodas_administrator" target="_blank">Murojat uchun</Link>
      </div>
      <div className="image">
        <img src="/shaxzoda.png" alt="shaxzoda" className="woman" />
      </div>
    </HomeLayout>
  );
}
