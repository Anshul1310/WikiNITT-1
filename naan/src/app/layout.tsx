// naan/src/app/layout.tsx
import ClientLayout from './ClientLayout'; 
// Remove direct Navbar/Footer imports from here

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}