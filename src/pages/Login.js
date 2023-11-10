import styles from '@/styles/Login.module.css';
import { dmSans } from '@/styles/fonts';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCookie, setCookie } from 'cookies-next';

export default function Login() {
  const router = useRouter();

  const [nis, setNis] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [rememberedNis, setRememberedNis] = useState('');
  const [rememberedPassword, setRememberedPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      setNis(lastInput.nis);
      setPassword(lastInput.password);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (rememberMe) {
      const rememberedNis = localStorage.getItem('rememberedNis');
      const rememberedPassword = localStorage.getItem('rememberedPassword');

      if (rememberedNis && rememberedPassword) {
        setNis(rememberedNis);
        setPassword(rememberedPassword);
        setRememberedNis(rememberedNis);
        setRememberedPassword(rememberedPassword);
      }
    }
  }, [rememberMe]);

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = { nis, password };

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

        // Set cookie jika "Ingat Saya" dicentang
        if (rememberMe) {
          setCookie('token', responseData.token, {
            maxAge: 60 * 60 * 24 * 7, // Expired dalam 7 hari
            path: '/',
          });
        }

        // Simpan nilai input terakhir ke dalam localStorage
        localStorage.setItem('lastInput', JSON.stringify({ nis, password }));

        router.push('/dashboard');
      } else {
        console.error('Gagal melakukan permintaan:', res.status);
        const responseData = await res.json();
        if (responseData.message === 'Password not found') {
          alert('Password tidak ditemukan');
        } else if (responseData.message === 'NIS not found') {
          alert('Name tidak ditemukan');
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
            NIS<span className={styles.star}>*</span>
          </div>
          <input
            className={styles.input}
            placeholder="12345"
            value={rememberMe ? rememberedNis : nis}
            onChange={(e) => setNis(e.target.value)}
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
            value={rememberMe ? rememberedPassword : password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.boxForgot}>
          <div className={styles.forgot}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            <div className={styles.forgot2}>Ingat Saya</div>
          </div>
          <div className={styles.forgot2}>
            <a href='./daftar'>Belum Punya Akun?</a>
          </div>
        </div>
        <button
          className={styles.buttonPrimary}
          onClick={handleLogin}
        >
          {isLoading ? 'Loading...' : 'Sign In'}
        </button>
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
