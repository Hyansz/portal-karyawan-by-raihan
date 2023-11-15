import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getCookie } from 'cookies-next';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      try {
        let myToken = '';
        if (localStorage.getItem('keepLogin') === 'true') {
          myToken = getCookie('token');
        } else {
          myToken = sessionStorage.getItem('token');
        }

        console.log('myToken: ', myToken);
        if (myToken) {
          const data = { token: myToken };
          const res = await fetch('/api/checkToken', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (res.ok) {
            const responseData = await res.json();
            console.log(responseData);
            router.push('/dashboard');
          } else {
            console.error('Gagal melakukan permintaan:', res.status);
            router.push('/login');
          }
        } else {
          router.push('/daftar');
        }
      } catch (error) {
        console.log('error: ', error);
        // alert('Terjadi Kesalahan, harap hubungi team support');
      }
    };

    run();
  }, [router]);

  useEffect(() => {
    const myCookieValue = getCookie('token');
    if (myCookieValue) {
      router.push('/dashboard');
    }
  }, [router]);

  useEffect(() => {
    const myCookieValue = getCookie('token');
    if (!myCookieValue) {
      router.push('/login');
    }
  }, [router]);

  return <></>;
}