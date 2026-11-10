function configuredFormId(value: string | undefined) {
  const id = value?.trim() ?? "";
  return /^YOUR_[A-Z0-9_]+_FORM_ID$/.test(id) ? "" : id;
}

export const formspreeFormIds = {
  contact: configuredFormId(process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ID),
  consultation: configuredFormId(process.env.NEXT_PUBLIC_FORMSPREE_CONSULTATION_ID),
  concierge: configuredFormId(process.env.NEXT_PUBLIC_FORMSPREE_CONCIERGE_ID),
  propertyInquiry: configuredFormId(process.env.NEXT_PUBLIC_FORMSPREE_PROPERTY_INQUIRY_ID),
} as const;

export type FormspreeForm = keyof typeof formspreeFormIds;
