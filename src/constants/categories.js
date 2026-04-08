import { 
  Cpu, Code, Palette, Megaphone, PenTool, 
  Headphones, Video, DollarSign, Scale, Users, Home 
} from 'lucide-react';

export const categories = [
  {
    id: 1,
    name: "AI & Emerging Tech",
    icon: Cpu,
    slug: "ai-emerging-tech",
    subCategories: ["AI App Development", "Chatbot Development", "Ethical Hacking", "Machine Learning", "OpenAI Jobs"]
  },
  {
    id: 2,
    name: "Development & IT",
    icon: Code,
    slug: "dev-it",
    subCategories: ["Mobile App Development", "Python Jobs", "Software Development", "Web Development", "WordPress Jobs"]
  },
  {
    id: 3,
    name: "Design & Creative",
    icon: Palette,
    slug: "design-creative",
    subCategories: ["Graphic Design", "Illustrators", "Logo Design", "UX Design", "Web Design"]
  },
  {
    id: 4,
    name: "Sales & Marketing",
    icon: Megaphone,
    slug: "sales-marketing",
    subCategories: ["Digital Marketing", "Email Marketing", "Google Ads", "SEO Jobs", "Social Media Management"]
  },
  {
    id: 5,
    name: "Writing & Content",
    icon: PenTool,
    slug: "writing-content",
    subCategories: ["Book Editing", "Content Writing", "Copywriting", "Email Copywriting", "Ghostwriting"]
  },
  {
    id: 6,
    name: "Admin & Support",
    icon: Headphones,
    slug: "admin-support",
    subCategories: ["Chat Support", "Cold Calling", "Content Moderation", "Lead Generation", "Virtual Assistant"]
  },
  {
    id: 7,
    name: "Video, Audio & Animation",
    icon: Video,
    slug: "video-audio-animation",
    subCategories: ["Animation", "Audio Editing", "Music Production", "Video Editing", "Voice Over"]
  },
  // የተቀሩት Categories እንደቀጠሉ ናቸው...
];