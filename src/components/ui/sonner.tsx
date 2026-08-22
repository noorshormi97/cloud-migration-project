import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-center"
      style={
        {
          "--normal-bg": "#fae588",
          "--normal-text": "#111111",
          "--normal-border": "rgba(17, 17, 17, 0.10)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast !bg-brand !text-ink !border-ink/10 !shadow-lg font-sans",
          title: "font-sans text-sm font-medium tracking-wide text-ink",
          description: "text-ink/70 font-sans",
          actionButton: "bg-ink text-brand",
          cancelButton: "bg-paper text-ink",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
