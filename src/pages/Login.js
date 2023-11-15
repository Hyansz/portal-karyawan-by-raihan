import styles from '@/styles/Login.module.css';
import { dmSans } from '@/styles/fonts';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCookie, setCookie } from 'cookies-next';

export default function Login() {
  const router = useRouter();

  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isKeepLogin, setKeepLogin] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const myCookieValue = getCookie('token');
      if (myCookieValue) {
        router.push('/dashboard');
      }
    };

    checkLoginStatus();
  }, [router]);

  useEffect(() => {
    const lastInput = JSON.parse(localStorage.getItem('lastInput'));
  
    if (lastInput) {
      setNip(lastInput.nip);
      setPassword(lastInput.password);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = { nip, password };

    setIsLoading(true); // Aktifkan efek loading

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const responseData = await res.json();
        alert('Sukses login');

        console.log('responseData: ', responseData); //ex: {token: 'Id2Qs257T0', isKeepLogin: true}
        localStorage.setItem('keepLogin', responseData.isKeepLogin);
        if (!responseData.isKeepLogin) {
          sessionStorage.setItem('token', responseData.token);
        }

        // Simpan nilai input terakhir ke dalam localStorage
        localStorage.setItem('lastInput', JSON.stringify({ nip, password, isKeepLogin }));

        router.push('/dashboard');
      } else {
        console.error('Gagal melakukan permintaan:', res.status);
        const responseData = await res.json();
        if (responseData.message === 'Password not found') {
          alert('Password tidak ditemukan');
        } else if (responseData.message === 'NIP not found') {
          alert('NIP tidak ditemukan');
        } else {
          alert(responseData.message);
        }
      }
    } catch (error) {
      console.log('error: ', error);
      alert('Terjadi Kesalahan, harap hubungi tim support');
    } finally {
      setIsLoading(false); // Matikan efek loading setelah permintaan selesai
    }
  }


  return (
    <div className={`${styles.container} ${dmSans.className}`}>
      <div className={styles.card}>
        <h1>Sign In</h1>
        <div className={styles.summary}>
          Enter your email and password to sign in!
        </div>
        <div className={styles.fieldInput}>
          <div className={styles.label}>
            NIP<span className={styles.star}>*</span>
          </div>
          <input
            className={styles.input}
            placeholder="12345"
            onChange={(e) => setNip(e.target.value)}
          />
        </div>
        <div className={styles.fieldInput}>
          <div className={styles.label}>
            Password<span className={styles.star}>*</span>
          </div>
          <input
            className={styles.input}
            placeholder="******"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <input
            type="checkbox"
            onChange={(e) => {
              console.log(e.target.checked);
              let isChecked = e.target.checked;
              localStorage.setItem('keepLogin', isChecked);
              setKeepLogin(isChecked);
            }}
          ></input>
          <span> Keep Me Logged In</span>
        </div>
        <button
          className={styles.buttonPrimary}
          onClick={handleLogin}
        >
          {isLoading ? 'Loading...' : 'Sign In'}
        </button>
        <div className={styles.boxForgot}>
          <div className={styles.forgot2}>
            <a href='./daftar'>Belum Punya Akun?</a>
          </div>
        </div>
      </div>
      
      <div className={styles.card2}>
        <div className={styles.text2}>
          <h1>Selamat Datang</h1>
          <p>Silahkan <b>Login</b> terlebih dahulu <br/> sebelum masuk ke dalam web.</p>
        </div>
      </div>
    </div>
  );
}
