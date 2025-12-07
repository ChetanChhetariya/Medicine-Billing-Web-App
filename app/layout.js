import './globals.css'

export const metadata = {
  title: 'Medicine Billing System',
  description: 'Professional pharmacy management system with beautiful UI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}