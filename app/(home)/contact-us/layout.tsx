export const metadata = {
  title: 'تماس با ما',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative  min-h-screen">
      <div
        className="absolute inset-0 -z-[1]"
        style={{
          background: `
        radial-gradient(ellipse 80% 60% at 70% 20%, rgba(250, 145, 60, 0.85), transparent 68%),
        radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.75), transparent 68%),
        radial-gradient(ellipse 60% 50% at 60% 65%, rgba(228, 10, 75, 0.58), transparent 68%),
        radial-gradient(ellipse 65% 40% at 50% 60%, rgba( 255, 215, 170, 0.3), transparent 68%),
        linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
      `,
        }}
      />
      {children}
    </div>
  )
}
