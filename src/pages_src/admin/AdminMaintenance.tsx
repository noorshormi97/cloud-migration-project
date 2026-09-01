import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMaintenanceMode, setMaintenanceMode } from '@/lib/maintenance';

export function AdminMaintenance() {
  const queryClient = useQueryClient();
  const { data: maintenance, isLoading } = useMaintenanceMode();

  const toggle = useMutation({
    mutationFn: (on: boolean) => setMaintenanceMode(on),
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ['maintenance-mode'] }),
  });

  return (
    <div className="max-w-2xl">
      <div className="border border-ink/10 bg-paper p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-heading text-2xl tracking-tight text-ink">
              Maintenance Mode
            </h3>
            <p className="mt-2 font-sans text-sm font-light leading-relaxed text-ink/70">
              While ON, every public page shows the maintenance screen. The admin
              panel stays fully accessible, and no product, stock, order, category
              or price data is changed.
            </p>
          </div>

          <span
            className={`border px-4 py-1.5 font-sans text-xs font-medium uppercase tracking-widest ${
              maintenance
                ? 'border-red-800 bg-red-50 text-red-800'
                : 'border-ink/20 bg-brand/60 text-ink/70'
            }`}
          >
            {isLoading
              ? '…'
              : maintenance
                ? 'Currently ON'
                : 'Currently OFF'}
          </span>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <span className="font-sans text-sm uppercase tracking-widest text-ink/60">
            Status:
          </span>
          <button
            type="button"
            disabled={isLoading || toggle.isPending}
            onClick={() => toggle.mutate(true)}
            className={`border px-6 py-2.5 font-sans text-xs font-medium uppercase tracking-widest transition-colors disabled:opacity-50 ${
              maintenance
                ? 'border-ink bg-ink text-brand'
                : 'border-ink/20 text-ink hover:border-ink/40'
            }`}
          >
            ON
          </button>
          <button
            type="button"
            disabled={isLoading || toggle.isPending}
            onClick={() => toggle.mutate(false)}
            className={`border px-6 py-2.5 font-sans text-xs font-medium uppercase tracking-widest transition-colors disabled:opacity-50 ${
              !maintenance
                ? 'border-ink bg-ink text-brand'
                : 'border-ink/20 text-ink hover:border-ink/40'
            }`}
          >
            OFF
          </button>
        </div>

        {toggle.isPending ? (
          <p className="mt-4 font-sans text-xs font-light text-ink/60">
            Saving…
          </p>
        ) : toggle.isError ? (
          <p className="mt-4 font-sans text-xs text-red-700">
            Failed to update maintenance mode. Please try again.
          </p>
        ) : (
          <p className="mt-4 font-sans text-xs font-light text-ink/50">
            {maintenance
              ? 'The public website is currently in maintenance mode.'
              : 'The public website is live.'}
          </p>
        )}
      </div>
    </div>
  );
}
