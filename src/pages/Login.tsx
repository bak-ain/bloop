import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import styles from "./Login.module.css";
import type { FanLoginInput, AgencyLoginInput } from "../types";
import { useUserContext } from "../context/UserContext ";

const Login = () => {
    const { users, setUser } = useUserContext(); // 추가
    const [step, setStep] = useState<"select" | "form">("select");
    const [userType, setUserType] = useState<"fan" | "agency">("fan");
    const [loginInput, setLoginInput] = useState<FanLoginInput | AgencyLoginInput>({
        id: "testfan", // 초기값 설정
        password: "1234",
        rememberMe: false,
        userType: "fan",
    });
    const navigate = useNavigate();





    // 탭 전환
    const handleTab = (type: "fan" | "agency") => {
        setUserType(type);
        setLoginInput({
            id: type === "fan" ? "testfan" : "testagency",
            password: type === "fan" ? "1234" : "5678",
            rememberMe: false,
            userType: type,
        });
    };


    // 입력값 변경
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setLoginInput(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // 로그인 처리
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // 실제 로그인 로직
        const found = users.find(
            u => u.id === loginInput.id &&
                u.password === loginInput.password &&
                u.userType === userType
        );
        if (found) {
            setUser(found); // 로그인 유저 저장!
            if (userType === "fan") {
                navigate("/");
            } else {
                // 어드민은 새로고침하면서 이동
                window.location.replace("/admin");
            }
        } else {
            alert("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
    };

    return (
        <Container>
            <div className={` ${styles.loginWrap} inner`}>
                    <div className={styles.formWrap}>
                        <div className={styles.tabRow}>
                            <button
                                className={`${styles.tabBtn} ${userType === "fan" ? styles.active : ""}`}
                                type="button"
                                onClick={() => handleTab("fan")}
                            >
                                Fan
                            </button>
                            <button
                                className={`${styles.tabBtn} ${userType === "agency" ? styles.active : ""}`}
                                type="button"
                                onClick={() => handleTab("agency")}
                            >
                                Agency
                            </button>
                        </div>
                        <div className={styles.loginTitle}>로그인</div>
                        <form onSubmit={handleLogin} className={styles.loginForm}>
                            <input
                                type="text"
                                name="id"
                                placeholder="Enter your ID"
                                value={loginInput.id}
                                onChange={handleChange}
                                className={styles.input}
                                required
                                autoComplete="username"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={loginInput.password}
                                onChange={handleChange}
                                className={styles.input}
                                required
                                autoComplete="current-password"
                            />
                            <div className={styles.optionRow}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={!!loginInput.rememberMe}
                                        onChange={handleChange}
                                    />{" "}
                                    아이디 저장
                                </label>
                                <span className={styles.optionLinks}>
                                    아이디 찾기&nbsp;|&nbsp;비밀번호찾기
                                </span>
                            </div>
                            <button type="submit" className={styles.loginBtn}>
                                로그인하기
                            </button>
                        </form>
                        <div className={styles.joinRow}>
                            아직 회원이 아니신가요?{" "}
                            <span
                                className={styles.join}
                                onClick={() => navigate(`/join?type=${userType}`)}
                                style={{ cursor: "pointer" }}
                            >
                                회원가입
                            </span>
                        </div>
                    </div>
            </div>
        </Container>
    );
};

export default Login;