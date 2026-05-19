"use client"

import { useForm } from "react-hook-form"

import { useRouter } from "next/navigation"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"

import { useSignin } from "~/hooks/api/auth"
// import { router } from "@repo/trpc/server/trpc"


type LoginFormValues = {
  email: string
  password: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const router = useRouter()

  const { siginUserWithEmailAndPasswordAsync } = useSignin()



  const onSubmit = async (values: LoginFormValues) => {
    console.log(values)

    const { id } = await siginUserWithEmailAndPasswordAsync({
      email: values.email,
      password: values.password,
    })

    console.log(`Signed in with id ${id}`)

    router.replace("/dashboard")
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  {...form.register("email", { required: true })}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...form.register("password", { required: true })}
                />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <Button variant="outline" type="button">
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
