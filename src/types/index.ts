export interface Room {
  roomNo: string;
  sharingType: string;
  bedsAvailable: number;
  ac: string;
}

export interface Branch {
  id: string;
  name: string;
  description: string;
  mainImage: string;
  galleryImages: string[];
  mapEmbedUrl: string;
  rooms: Room[];
}

export interface User {
  uid: string;
  email: string;
}