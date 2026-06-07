import z from "zod"

export const registerUserSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2, "Name should be at least 2 characters."),
    password: z.string().min(4).refine((password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/
        return regex.test(password)
    },
        { message: "password must be" }),
    passwordConfirm: z.string()
})
    .superRefine((data, ctx) => {
        if (data.password !== data.passwordConfirm) {
            ctx.addIssue({
                message: "passwords do not match",
                path: ["passwordConfirm"],
                code: "custom"
            })
        }
    })