'use client'

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { passwordSchema } from "@/validation/passwordSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { loginWithCredentials } from "./actions"
import { useRouter } from "next/navigation"
import Link from "next/link"


const formSchema = z.object({
    email: z.string().email(),
    password: passwordSchema
})

const Login = () => {

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const submitHandler = async (data: z.infer<typeof formSchema>) => {
        const response = await loginWithCredentials({
            email: data.email,
            password: data.password
        })

        if (response?.error) {
            form.setError("root", {
                message: response.message
            })
        } else {
            router.push("/my-account")
        }
    }

    return (
        <main className="flex justify-center items-center min-h-screen">
            <Card className="w-sm">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(submitHandler)}
                        >
                            <fieldset disabled={form.formState.isSubmitting}
                                className="flex flex-col gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) =>
                                    (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                    }
                                /><FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) =>
                                    (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input {...field}
                                                    type="password" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                    }
                                />
                                {!!form.formState.errors.root?.message &&
                                    <FormMessage>
                                        {form.formState.errors.root.message}
                                    </FormMessage>
                                }
                                <Button type="submit"
                                    className="mt-6">LOGIN</Button>
                            </fieldset>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 text-muted-foreground text-sm">
                    <div className="flex flex-row ">
                        Don't have an account?

                        <Link href="/register"
                            className="underline border border-blue-950 rounded-2xl mx-2 px-3">
                            Sign Up
                        </Link>
                    </div>
                    <div className="flex flex-row ">Forgot password?{" "}
                        <Link href="/password-reset"
                            className="underline border border-blue-950 rounded-2xl mx-2 px-3">
                            Reset the password
                        </Link>
                    </div>

                </CardFooter>
            </Card>
        </main>
    )
}

export default Login