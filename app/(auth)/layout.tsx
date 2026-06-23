export default function Layout({ children }: { children: React.ReactNode }){
    return(
        <div className="max-w-sm mx-auto my-4">
            {children}
        </div>
    )
}

