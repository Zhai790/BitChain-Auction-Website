import BrushIcon from '@mui/icons-material/Brush';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import VideocamIcon from '@mui/icons-material/Videocam';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import type { Category } from '../types/category';

export const CATEGORIES: Category[] = [
  { id: 'ART', title: 'Art', icon: BrushIcon },
  { id: 'MUSIC', title: 'Music', icon: MusicNoteIcon },
  { id: 'GAMING', title: 'Gaming', icon: SportsEsportsIcon },
  { id: 'PHOTOGRAPHY', title: 'Photography', icon: PhotoCameraIcon },
  { id: 'VIDEO', title: 'Video', icon: VideocamIcon },
  { id: 'SPORT', title: 'Sport', icon: SportsBasketballIcon },
];
