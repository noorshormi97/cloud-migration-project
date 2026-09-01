import { useQuery } from '@tanstack/react-query';
import { fetchContactDetails } from '@/lib/content';

// WhatsApp deep link. wa.me automatically opens the WhatsApp app on mobile
// when installed and falls back to WhatsApp Web; on desktop it opens
// WhatsApp Web/Desktop. The number comes from Admin → Contact Details.
export function useWhatsAppNumber() {
  const { data } = useQuery({
    queryKey: ['contact-details'],
    queryFn: fetchContactDetails,
    staleTime: 5 * 60 * 1000,
  });
  const raw = data?.whatsapp_number ?? '';
  return raw.replace(/[^\d]/g, '');
}

export function askForPriceUrl(whatsappNumber: string, productName: string) {
  const message = `Hello, I'm interested in ${productName}. Could you please let me know the current price?`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
