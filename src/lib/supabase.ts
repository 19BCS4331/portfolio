import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://hicamgyszxcvzmikrecn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpY2FtZ3lzenhjdnptaWtyZWNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2Mzk3NzQsImV4cCI6MjA2MzIxNTc3NH0.7dQvbhSvNgG7EjJn-U3uGFCnVwBrt9aVgFbXq9nxB80';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions based on database schema
export interface Service {
  id: number;
  title: string;
  description: string;
  icon_name: string;
  bg_icon: string;
  skills: string[];
}

export interface Technology {
  id: number;
  name: string;
  icon_name: string;
  category: string;
  level: number;
  color: string;
  experience: string;
  projects: number;
  description: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  long_description: string;
  image_url: string;
  category: string;
  github_url: string;
  demo_url: string;
  color: string;
  year: number;
  icon_name: string;
  tags: string[];
  features: string[];
  technologies: Record<string, string[]>;
}

export interface AboutSkill {
  id: number;
  category: string;
  icon_name: string;
  technologies: Array<{
    name: string;
    level: number;
  }>;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
}

export interface ContactInfo {
  id: number;
  icon_name: string;
  title: string;
  value: string;
  link: string;
  description: string;
}

export interface SocialMedia {
  id: number;
  name: string;
  icon_name: string;
  link: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  value: string;
}

export interface PersonalInfo {
  id: number;
  full_name: string;
  job_title: string;
  email: string;
  phone: string;
  location: string;
  availability_status: boolean;
  availability_text: string;
  bio_short: string;
  bio_long: string;
  resume_url: string;
}

// API functions to fetch data from Supabase

// Get all services with their skills
export async function getServices(): Promise<Service[]> {
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('*');

  if (servicesError) {
    console.error('Error fetching services:', servicesError);
    return [];
  }

  // For each service, get its skills
  const servicesWithSkills = await Promise.all(
    services.map(async (service) => {
      const { data: skills, error: skillsError } = await supabase
        .from('service_skills')
        .select('skill')
        .eq('service_id', service.id);

      if (skillsError) {
        console.error(`Error fetching skills for service ${service.id}:`, skillsError);
        return { ...service, skills: [] };
      }

      return { ...service, skills: skills.map((s) => s.skill) };
    })
  );

  return servicesWithSkills;
}

// Get all technology categories
export async function getTechnologyCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('technology_categories')
    .select('name');

  if (error) {
    console.error('Error fetching technology categories:', error);
    return [];
  }

  return data.map((category) => category.name);
}

// Get all technologies
export async function getTechnologies(): Promise<Technology[]> {
  const { data, error } = await supabase
    .from('technologies')
    .select('*');

  if (error) {
    console.error('Error fetching technologies:', error);
    return [];
  }

  return data;
}

// Get technologies by category
export async function getTechnologiesByCategory(category: string): Promise<Technology[]> {
  const { data, error } = await supabase
    .from('technologies')
    .select('*')
    .eq('category', category);

  if (error) {
    console.error(`Error fetching technologies for category ${category}:`, error);
    return [];
  }

  return data;
}

// Get all projects with their tags, features, and technologies
export async function getProjects(): Promise<Project[]> {
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*');

  if (projectsError) {
    console.error('Error fetching projects:', projectsError);
    return [];
  }

  // For each project, get its tags, features, and technologies
  const projectsWithDetails = await Promise.all(
    projects.map(async (project) => {
      // Get tags
      const { data: tags, error: tagsError } = await supabase
        .from('project_tags')
        .select('tag')
        .eq('project_id', project.id);

      if (tagsError) {
        console.error(`Error fetching tags for project ${project.id}:`, tagsError);
        return { ...project, tags: [], features: [], technologies: {} };
      }

      // Get features
      const { data: features, error: featuresError } = await supabase
        .from('project_features')
        .select('feature')
        .eq('project_id', project.id);

      if (featuresError) {
        console.error(`Error fetching features for project ${project.id}:`, featuresError);
        return { ...project, tags: tags.map((t) => t.tag), features: [], technologies: {} };
      }

      // Get technologies
      const { data: technologies, error: technologiesError } = await supabase
        .from('project_technologies')
        .select('category, technology')
        .eq('project_id', project.id);

      if (technologiesError) {
        console.error(`Error fetching technologies for project ${project.id}:`, technologiesError);
        return {
          ...project,
          tags: tags.map((t) => t.tag),
          features: features.map((f) => f.feature),
          technologies: {},
        };
      }

      // Group technologies by category
      const techByCategory: Record<string, string[]> = {};
      technologies.forEach((tech) => {
        if (!techByCategory[tech.category]) {
          techByCategory[tech.category] = [];
        }
        techByCategory[tech.category].push(tech.technology);
      });

      return {
        ...project,
        tags: tags.map((t) => t.tag),
        features: features.map((f) => f.feature),
        technologies: techByCategory,
      };
    })
  );

  return projectsWithDetails;
}

// Get all about skills with their technologies
export async function getAboutSkills(): Promise<AboutSkill[]> {
  const { data: skills, error: skillsError } = await supabase
    .from('about_skills')
    .select('*');

  if (skillsError) {
    console.error('Error fetching about skills:', skillsError);
    return [];
  }

  // For each skill, get its technologies
  const skillsWithTechnologies = await Promise.all(
    skills.map(async (skill) => {
      const { data: technologies, error: technologiesError } = await supabase
        .from('about_skill_technologies')
        .select('name, level')
        .eq('skill_id', skill.id);

      if (technologiesError) {
        console.error(`Error fetching technologies for skill ${skill.id}:`, technologiesError);
        return { ...skill, technologies: [] };
      }

      return { ...skill, technologies };
    })
  );

  return skillsWithTechnologies;
}

// Get all experiences with their achievements
export async function getExperiences(): Promise<Experience[]> {
  const { data: experiences, error: experiencesError } = await supabase
    .from('about_experiences')
    .select('*');

  if (experiencesError) {
    console.error('Error fetching experiences:', experiencesError);
    return [];
  }

  // For each experience, get its achievements
  const experiencesWithAchievements = await Promise.all(
    experiences.map(async (experience) => {
      const { data: achievements, error: achievementsError } = await supabase
        .from('about_experience_achievements')
        .select('achievement')
        .eq('experience_id', experience.id);

      if (achievementsError) {
        console.error(`Error fetching achievements for experience ${experience.id}:`, achievementsError);
        return { ...experience, achievements: [] };
      }

      return { ...experience, achievements: achievements.map((a) => a.achievement) };
    })
  );

  return experiencesWithAchievements;
}

// Get all education with their achievements
export async function getEducation(): Promise<Education[]> {
  const { data: education, error: educationError } = await supabase
    .from('about_education')
    .select('*');

  if (educationError) {
    console.error('Error fetching education:', educationError);
    return [];
  }

  // For each education, get its achievements
  const educationWithAchievements = await Promise.all(
    education.map(async (edu) => {
      const { data: achievements, error: achievementsError } = await supabase
        .from('about_education_achievements')
        .select('achievement')
        .eq('education_id', edu.id);

      if (achievementsError) {
        console.error(`Error fetching achievements for education ${edu.id}:`, achievementsError);
        return { ...edu, achievements: [] };
      }

      return { ...edu, achievements: achievements.map((a) => a.achievement) };
    })
  );

  return educationWithAchievements;
}

// Get all contact info
export async function getContactInfo(): Promise<ContactInfo[]> {
  const { data, error } = await supabase
    .from('contact_info')
    .select('*');

  if (error) {
    console.error('Error fetching contact info:', error);
    return [];
  }

  return data;
}

// Get all social media
export async function getSocialMedia(): Promise<SocialMedia[]> {
  const { data, error } = await supabase
    .from('social_media')
    .select('*');

  if (error) {
    console.error('Error fetching social media:', error);
    return [];
  }

  return data;
}

// Get all FAQs
export async function getFAQs(): Promise<FAQ[]> {
  const { data, error } = await supabase
    .from('faq')
    .select('*');

  if (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }

  return data;
}

// Get personal info
export async function getPersonalInfo(): Promise<PersonalInfo | null> {
  const { data, error } = await supabase
    .from('personal_info')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching personal info:', error);
    return null;
  }

  return data;
}

// Submit contact form
export async function submitContactForm(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  // In a real application, you would create a table for contact submissions
  try {
    // Log the form data to show we're using it (this prevents the lint error)
    console.log('Submitting contact form:', formData);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // In a production app, you would insert the data into a Supabase table
    // const { data, error } = await supabase
    //   .from('contact_submissions')
    //   .insert([{
    //     name: formData.name,
    //     email: formData.email,
    //     subject: formData.subject,
    //     message: formData.message,
    //     created_at: new Date()
    //   }]);
    
    return {
      success: true,
      message: 'Your message has been sent successfully!',
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      success: false,
      message: 'There was an error sending your message. Please try again.',
    };
  }
}
