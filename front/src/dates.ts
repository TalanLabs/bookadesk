import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";

const getReadableDate = (dateString: string) => {
  const date = parse(dateString, "yyyyMMdd", new Date());
  return format(date, "cccc d MMMM", {
    locale: fr
  });
};

export { getReadableDate };
