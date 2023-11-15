import styles from "@/styles/Login.module.css";
import { dmSans } from "@/styles/fonts";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Daftar() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [nip, setNip] = useState(""); // Mengganti nip menjadi nip
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className={`${styles.container} ${dmSans.className}`}>
            <div className={styles.card}>
                <h1>Daftar</h1>
                <div className={styles.summary}>
                    Masukkan data secara lengkap
                </div>
                <div className={styles.fieldInput}>
                    <div className={styles.label}>
                        Name<span className={styles.star}>*</span>
                    </div>
                    <input
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                        className={styles.input}
                        placeholder="Enter Your Full Name"
                    />
                </div>
                <div className={styles.fieldInput}>
                    <div className={styles.label}>
                        NIP<span className={styles.star}>*</span>{" "}
                        {/* Mengganti NIP menjadi nip */}
                    </div>
                    <input
                        className={styles.input}
                        placeholder="12345" // Mengganti placeholder sesuai dengan format nip
                        onChange={(e) => {
                            setNip(e.target.value);
                        }}
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
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                </div>
                <div className={styles.boxForgot}>
                    <div className={styles.forgot3}>
                        <a href='./login'>Sudah Punya Akun?</a>
                    </div>
                </div>
                <button
                    className={styles.buttonPrimary}
                    onClick={async () => {
                        const data = { name, nip, password }; // Mengganti nip menjadi nip
                        console.log("click daftar by: ", data);
                        setIsLoading(true);

                        try {
                            const res = await fetch("/api/registration", {
                                method: "POST",
                                body: JSON.stringify(data),
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            });

                            if (res.ok) {
                                const responseData = await res.json();
                                console.log(responseData);
                                alert("Data sudah sukses didaftarkan");

                                // Redirect ke halaman login setelah pendaftaran berhasil
                                router.push("/login");
                            } else {
                                console.error(
                                    "Gagal melakukan permintaan:",
                                    res.status
                                );
                                alert("Data gagal didaftarkan");
                            }
                        } catch (error) {
                            console.log("error: ", error);
                            alert(
                                "Terjadi Kesalahan, harap hubungi team support"
                            );
                        } finally {
                            setIsLoading(false); // Matikan efek loading setelah permintaan selesai
                        }
                    }}
                >
                    {isLoading ? 'Loading...' : 'Daftar'}
                </button>
            </div>

            <div className={styles.card3}>
                <div className={styles.text2}>
                    <h1>Selamat Datang</h1>
                    <p>
                        Silahkan <b>Daftar</b> terlebih dahulu <br /> sebelum masuk ke
                        dalam web.
                    </p>
                </div>
            </div>
        </div>
    );
}
