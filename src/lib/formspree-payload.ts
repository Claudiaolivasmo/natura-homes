import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js/min";

type FormspreeField = string | number | boolean | null | undefined;
export type FormspreeValues = Record<string, FormspreeField | FormspreeField[]>;

export function prepareFormspreePayload(values: FormspreeValues): FormspreeValues | null {
  const { whatsapp, ...formValues } = values;
  if (whatsapp === undefined || whatsapp === null || whatsapp === "") return formValues;
  if (typeof whatsapp !== "string" || !isValidPhoneNumber(whatsapp)) return null;

  const phone = parsePhoneNumber(whatsapp);
  if (!phone) return null;

  return {
    ...formValues,
    phone: phone.number,
    ...(phone.country ? { phone_country: phone.country } : {}),
    phone_country_code: `+${phone.countryCallingCode}`,
  };
}
