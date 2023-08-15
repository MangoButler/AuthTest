import { getSession, useSession } from "next-auth/react";
import AuthForm from "../components/auth/auth-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function AuthPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.replace("/profile");
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);
 

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <AuthForm />;
}

export default AuthPage;

// export async function getServerSideProps(context) {
//   const session = await getSession({ req: context.req });

//   if (session) {
//     return {
//       redirect: {
//         destination: "/profile",
//         permantent: false,
//       },
//     };
//   }
//   return {
//     props: { session },
//   };
// }




// const { data: session, status } = useSession();
// const isLoading = status === 'loading';

// useEffect(() => {
//   if(status === 'authenticated'){
//     router.replace('/');
//   }
// }, [status, session])