export default function Layout({ children }: { children: React.ReactNode }){
    return(
        <div className="max-w-sm mx-auto my-4">
            {children}
        </div>
    )
}



/* 
import {auth} from "@/firebse/server"
import { cookies } from "next/headers"

export const setToken = async ({
    token,
    refreshToken,
}: {
    token: string,
    refreshToken: string
}) => {
    try {
        const verifedToken = await auth.verifedToken(token)
        if (!verifedToken){
            return;
        }
        const userRecord = await auth.getUser(verifedToken.uid)
        if (process.env.ADMIN_EMAIL === userRecord.email && !userRecord.customClaims?.admin) {
            auth.costomClaims(verifedToken.uid, {
                admin: true
            })
        }

        const cookieStore = await cookies();
        cookieStore.set("firebseAuthToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        })
        cookieStore.set('firebseAuthRefreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });

        } catch(e){
            console.log(e)
        }
    }
 */