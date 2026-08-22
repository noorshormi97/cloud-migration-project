import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-brand group-[.toaster]:text-ink group-[.toaster]:border-ink/10 group-[.toaster]:shadow-lg group-[.toaster]:font-sans",
          title: "group-[.toast]:font-sans group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:tracking-wide",
          description: "group-[.toast]:text-ink/70 group-[.toast]:font-sans",
          actionButton: "group-[.toast]:bg-ink group-[.toast]:text-brand",
          cancelButton: "group-[.toast]:bg-paper group-[.toast]:text-ink",
          success: "group-[.toast]:[&[data-sonner-toast]]:border-l-4 group-[.toast]:[&[data-sonner-toast]]:border-l-ink",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
