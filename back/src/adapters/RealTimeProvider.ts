import { TimeProvider } from "../usecase/ports/TimeProvider";
import { format } from "date-fns";

export class RealTimeProvider implements TimeProvider {
  today(): string {
    return format(new Date(), "yyyyMMdd");
  }
}
