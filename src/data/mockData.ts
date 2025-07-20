import { Branch } from '../types';

export const branches: Branch[] = [
  {
    id: 'branch-1',
    name: 'Downtown Branch',
    description: 'Located in the heart of the city, our downtown branch offers modern amenities and easy access to public transportation. Perfect for working professionals and students who want to be close to the action.',
    mainImage: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
    galleryImages: [
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/462235/pexels-photo-462235.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.5273612473624!2d-74.00369368459418!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1633024800000!5m2!1sen!2sus',
    rooms: [
      { roomNo: '101', sharingType: 'Single', bedsAvailable: 1 },
      { roomNo: '102', sharingType: 'Double', bedsAvailable: 1 },
      { roomNo: '103', sharingType: 'Triple', bedsAvailable: 2 },
      { roomNo: '104', sharingType: 'Single', bedsAvailable: 0 },
      { roomNo: '105', sharingType: 'Double', bedsAvailable: 2 }
    ]
  },
  {
    id: 'branch-2',
    name: 'University Branch',
    description: 'Situated near the university campus, this branch provides a quiet and studious environment. With dedicated study areas and high-speed internet, it\'s ideal for students and researchers.',
    mainImage: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    galleryImages: [
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/462235/pexels-photo-462235.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ],
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731688459395!3d40.67881007932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3bda30d%3A0xb89d1fe6bc499443!2sDowntown%20Brooklyn!5e0!3m2!1sen!2sus!4v1633024900000!5m2!1sen!2sus',
    rooms: [
      { roomNo: '201', sharingType: 'Single', bedsAvailable: 1 },
      { roomNo: '202', sharingType: 'Double', bedsAvailable: 0 },
      { roomNo: '203', sharingType: 'Triple', bedsAvailable: 1 },
      { roomNo: '204', sharingType: 'Single', bedsAvailable: 1 },
      { roomNo: '205', sharingType: 'Double', bedsAvailable: 2 }
    ]
  }
];