import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState } from "react"
import { ButtonSubmit } from "@/components/actions/button-submit"
import { login } from "./actions"
import { ButtonDialog } from "@/components/actions/button-dialog"
import RegistrationForm from "@/components/dialogs/registration/frmregistration"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [state, loginAction] = useActionState(login, undefined)
  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form action={loginAction} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Acme Inc account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              {state?.errors?.email && (
                <p className="text-red-500">{state.errors.email}</p>
              )}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" name="password" required />
              </div>
              {state?.errors?.password && (
                <p className="text-red-500">{state.errors.password}</p>
              )}
              <ButtonSubmit label="Login"/>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <ButtonDialog dialogForm={RegistrationForm} label="Register" dialog_title="Welcome to KALAHI-CIDSS Information System" css="underline underline-offset-4 cursor-pointer"/>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}