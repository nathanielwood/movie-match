// import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-2 mt-10">
      <h1 className="text-5xl">Welcome to Movie Match</h1>
      <div className="mt-10">
        <Link href="/quiz" className="bg-white p-3 rounded-md">Play&nbsp;&nbsp;<span className="font-bold">&quot;Who starred in...&quot;</span></Link>
      </div>
    </div>
  )
}

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// }
