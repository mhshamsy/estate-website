"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { registerUser } from "./actions";
import Link from "next/link";

const formSchema = z
  .object({
    email: z.string().email(),
  })
  .and(passwordMatchSchema);

const Register = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const submitHandler = async (data: z.infer<typeof formSchema>) => {
    const response = await registerUser({
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    });

    if (response?.error) {
      form.setError("email", {
        message: response?.message,
      });
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen">
      {form.formState.isSubmitSuccessful ? (
        <Card className="w-sm text-center">
          <CardHeader>
            <CardTitle>Your accoun has been created</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Link href="/login">Login to your account</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-sm">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Sign up for a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submitHandler)}>
                <fieldset
                  disabled={form.formState.isSubmitting}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="passwordConfirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>passwordConfirm</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-6">
                    REGISTER
                  </Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 text-muted-foreground text-sm">
            <div className="flex flex-row ">
              Already have an account?
              <Link
                href="/login"
                className="underline border border-blue-900 rounded-2xl mx-2 px-3"
              >
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
    </main>
  );
};

export default Register;
