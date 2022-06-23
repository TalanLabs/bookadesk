import axios from "axios";
import config from "@/config";
import {
  Booking,
  BookingDetails,
  DayAlreadyBookedError,
  MissingSupply,
  Office,
  Place,
  PlaceAlreadyBookedError
} from "@/types";

const apiUrl = config.apiUrl;

export const deleteBooking = async (
  bookingId: string
): Promise<void | Error> => {
  try {
    const response = await axios.delete(`${apiUrl}/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error("Could not delete booking", error);
    return error;
  }
};

export const getOffice = async (officeId: string) => {
  try {
    const response = await axios.get(`${apiUrl}/offices/${officeId}`);
    return response.data;
  } catch (error) {
    console.error("Could not fetch places list", error);
  }
};
export const getOffices = async (): Promise<Office[] | undefined> => {
  try {
    const response = await axios.get(`${apiUrl}/offices`);
    const offices = response.data;
    const promises = offices.map(async (o: Office) => {
      const res = await axios.get(`${apiUrl}/offices/${o.id}`);
      return res.data;
    });
    const officesWithFloors: Office[] = await Promise.all(promises);
    return officesWithFloors;
  } catch (error) {
    console.error("Could not fetch offices list", error);
  }
};

export const getPlaces = async (
  officeId: string,
  floorId: string
): Promise<Place[] | undefined> => {
  try {
    const response = await axios.get(
      `${apiUrl}/offices/${officeId}/floors/${floorId}/places`
    );
    return response.data;
  } catch (error) {
    console.error("Could not fetch places list", error);
  }
};

export const saveOffices = async (office: Office[]): Promise<Office> => {
  try {
    const response = await axios.put(`${apiUrl}/offices`, office);
    return response.data;
  } catch (e) {
    throw new Error("Unexpected error");
  }
};

export const getBookings = async (officeId: string, date: string) => {
  try {
    const response = await axios.get(
      `${apiUrl}/offices/${officeId}/bookings?date=${date}`
    );
    return response.data;
  } catch (error) {
    console.error("Could not fetch bookings", error);
  }
};
export const getNextBooking = async (): Promise<BookingDetails | undefined> => {
  try {
    const response = await axios.get(`${apiUrl}/bookings/next`);
    return response.data;
  } catch (error) {
    console.error("Could not fetch next booking", error);
  }
};
export const getNextBookings = async (): Promise<Booking[]> => {
  try {
    const response = await axios.get(`${apiUrl}/bookings/all-next`);
    return response.data;
  } catch (error) {
    console.error("Could not fetch next bookings", error);
    return [];
  }
};
export const getStats = async (
  offices: string[],
  startDate: string,
  endDate: string
) => {
  try {
    const res = await axios.get(`${apiUrl}/bookings/stats`, {
      params: { offices: offices, startDate: startDate, endDate: endDate }
    });
    return res.data;
  } catch (e) {
    console.error("Could not fetch stats", e);
  }
};
export const getVersion = async () => {
  try {
    const response = await axios.get(`${apiUrl}/health`);
    return response.data.version;
  } catch (error) {
    console.error("Server is down", error);
  }
};
export const bookPlace = async (options: {
  date: string;
  placeId: string;
  officeId: string;
}): Promise<void | Error> => {
  try {
    await axios.post(`${apiUrl}/offices/${options.officeId}/book`, {
      date: options.date,
      placeId: options.placeId
    });
    return;
  } catch (error) {
    const res = error.response;
    if (res.status === 400 && res.data) {
      if (res.data.code === "PLACE_ALREADY_BOOKED") {
        return new PlaceAlreadyBookedError();
      }
      if (res.data.code === "DAY_ALREADY_BOOKED") {
        return new DayAlreadyBookedError();
      }
    }
    return new Error("Unexpected error");
  }
};

export const confirmPresence = async (
  bookingId: string
): Promise<void | Error> => {
  try {
    await axios.post(`${apiUrl}/bookings/${bookingId}/confirm`);
  } catch (e) {
    return new Error("Unexpected error");
  }
};

export const deletePlace = async (placeId: string): Promise<void | Error> => {
  try {
    await axios.delete(`${apiUrl}/places/${placeId}`);
  } catch (e) {
    return new Error("Unexpected error");
  }
};

export const notifyMissingSupplies = async (
  officeId: string,
  type: string,
  comments: string
): Promise<void | Error> => {
  try {
    await axios.post(`${apiUrl}/supplies/notify`, {
      officeId,
      type: type,
      comments
    });
  } catch (e) {
    return new Error("Unexpected error");
  }
};

export const getMissingSupplies = async (
  officeId: string
): Promise<MissingSupply[] | Error> => {
  try {
    const res = await axios.get(`${apiUrl}/supplies`, { params: { officeId } });
    return res.data;
  } catch (e) {
    return new Error("Unexpected error");
  }
};

export const saveFloorPlaces = async (
  officeId: string,
  floorId: string,
  places: Place[]
): Promise<void | Error> => {
  try {
    await axios.put(
      `${apiUrl}/offices/${officeId}/floors/${floorId}/places`,
      places
    );
  } catch (e) {
    return new Error("Unexpected error");
  }
};

export const uploadFile = async (
  formData: FormData,
  floorId: string,
  officeId: string
): Promise<void> => {
  try {
    await axios.post(
      `${apiUrl}/offices/${officeId}/floors/${floorId}/plan`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
  } catch (e) {
    throw new Error("Couldn't upload image of plan");
  }
};

export const getFloorPlan = async (
  floorId: string,
  officeId: string
): Promise<string> => {
  try {
    const res = await axios.get(
      `${apiUrl}/offices/${officeId}/floors/${floorId}/plan`
    );
    return res.data;
  } catch (e) {
    throw new Error("Couldn't fetch image of plan");
  }
};

export const updateFloorName = async (
  officeId: string,
  floorId: string,
  floorName: string
): Promise<void | Error> => {
  try {
    await axios.put(`${apiUrl}/offices/${officeId}/floors/${floorId}/name`, {
      floorName
    });
  } catch (e) {
    return new Error("Unexpected error");
  }
};

export interface BackendConfig {
  keycloakRealm: string;
  hidePlans: boolean;
}

export const getBackendConfig = async (): Promise<BackendConfig | Error> => {
  try {
    const res = await axios.get(`${apiUrl}/config`);
    return res.data;
  } catch (e) {
    return new Error("Unexpected error");
  }
};

export const createGroup = async (name: string): Promise<void | Error> => {
  try {
    await axios.post(`${apiUrl}/groups`, {
      name
    });
  } catch (e) {
    return new Error("Unexpected error");
  }
};
