import styles from "@/styles/Login.module.css";
import { dmSans } from "@/styles/fonts";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Daftar() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [nis, setNis] = useState("");
    const [password, setPassword] = useState("");

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
                        placeholder="your full name"
                    />
                </div>
                <div className={styles.fieldInput}>
                    <div className={styles.label}>
                        NIS<span className={styles.star}>*</span>
                    </div>
                    <input
                        className={styles.input}
                        placeholder="12345"
                        onChange={(e) => {
                            setNis(e.target.value);
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
                <button
                    className={styles.buttonPrimary}
                    onClick={async () => {
                        const data = { name, nis, password };
                        console.log("click daftar by: ", data);

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
                        }
                    }}
                >
                    Daftar
                </button>
            </div>
        </div>
    );
}