import React, { createContext, useContext, useState } from "react";
import type { FanSignupInput, AgencySignupInput } from "../types";
import { useEffect } from "react";

type User = FanSignupInput | AgencySignupInput;
type UserType = User | null;

interface UserContextProps {
    user: UserType;
    setUser: (user: UserType) => void;
    users: User[];
    addUser: (user: User) => void;
}

// 초기 유저(팬, 에이전시) 추가
const initialUsers: User[] = [
    {
        userType: "fan",
        id: "testfan",
        nickname: "비스러버",
        password: "1234",
        confirmPassword: "1234",
        name: "이소민",
        email: "testfan@naver.com",
        phone: "010-1234-5678",
        gender: "female",
        birth: { year: "2000", month: "01", day: "01" },
        agree: { privacy: true, communityPolicy: true, marketing: false, over14: true },
        profileImage: "/images/profile_img.png" // 프로필 이미지 추가
    },
    {
        userType: "agency",
        company: "테스트기획사",
        artistName: "하이비스",
        id: "testagency",
        password: "5678",
        confirmPassword: "5678",
        name: "김기획",
        email: "testagency@daum.net",
        phone: "010-8765-4321",
        agree: { privacy: true, uploadResponsibility: true, marketing: false, over14: true },
        profileImage: "/images/profile_img.png" // 프로필 이미지 추가
    }
];

const USER_STORAGE_KEY = "bloop_user";

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    // sessionStorage에서 user 불러오기
    const [user, setUserState] = useState<UserType>(() => {
        const stored = sessionStorage.getItem(USER_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    });
    const [users, setUsers] = useState<User[]>(initialUsers);

    // user가 바뀔 때마다 sessionStorage에 저장
    useEffect(() => {
        if (user) {
            sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } else {
            sessionStorage.removeItem(USER_STORAGE_KEY);
        }
    }, [user]);

    // setUser 함수 래핑
    const setUser = (u: UserType) => setUserState(u);

    const addUser = (newUser: User) => setUsers(prev => [...prev, newUser]);

    return (
        <UserContext.Provider value={{ user, setUser, users, addUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("UserContext not found");
    return ctx;
};