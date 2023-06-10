import React from "react";
import Image from "next/image";
import supabase from "@/util/supabase";

type Props = {};

export default function Login({}: Props) {

    const [username, setUsername] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");

    // after 5 seconds, clear the error message
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setError("");
        }, 8000);
        return () => {
            clearTimeout(timeout);
        }
    }, [error]);

    const loginWithCredentials = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        supabase.auth.signInWithPassword({
            email: username,
            password: password,
        }).then(({error}) => {
            if (error) {
                setError(error.message);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    const loginWithGoogle = () => {
        supabase.auth.signInWithOAuth({
            provider: "google",
        }).then(({error}) => {
            if (error) {
                setError(error.message);
            }    
        }).catch((error) => {
            console.log(error);
        });
    }


	return (
		<>
			<div className="flex justify-center items-center h-screen">
				<div className="flex flex-col gap-5">
					<h1 className="text-4xl font-bold text-white">Login</h1>
                    <form onSubmit={loginWithCredentials}>
                        <div className="flex flex-col gap-1">
                            <label className="flex flex-col gap-1">
                                <span className="text-white">Username</span>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded px-2 py-1"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </label>
                            <label className="flex flex-col gap-1">
                                <span className="text-white">Password</span>
                                <input
                                    type="password"
                                    className="border border-gray-300 rounded px-2 py-1"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </label>
                        </div>
                        <button className="mt-3 w-full px-3 py-2 bg-zinc-500 hover:bg-zinc-600 transition-colors text-white rounded">
                            Login
                        </button>
                        <span className="text-red-500 mt-3 block">{error}</span>
                    </form>
                    <button onClick={loginWithGoogle} className=" bg-white hover:bg-zinc-200 transition-colors border border-zinc-300 rounded py-2 flex gap-1 items-center justify-center">
                        <span>Sign in with Google</span>   
                    <Image src="/google.png" alt="Google Logo" width={20} height={20} className="ml-2" style={{objectFit: "contain"}}/>
                    </button>
				</div>
			</div>
		</>
	);
}
