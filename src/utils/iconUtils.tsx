import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import * as DiIcons from 'react-icons/di';
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as BsIcons from 'react-icons/bs';
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io';
import * as Io5Icons from 'react-icons/io5';
import * as RiIcons from 'react-icons/ri';
import * as TiIcons from 'react-icons/ti';
import * as GiIcons from 'react-icons/gi';
import * as HiIcons from 'react-icons/hi';
import * as CgIcons from 'react-icons/cg';
import * as VscIcons from 'react-icons/vsc';

// Define a mapping of icon libraries
const iconLibraries = {
  fa: FaIcons,
  si: SiIcons,
  di: DiIcons,
  ai: AiIcons,
  bi: BiIcons,
  bs: BsIcons,
  md: MdIcons,
  io: IoIcons,
  io5: Io5Icons,
  ri: RiIcons,
  ti: TiIcons,
  gi: GiIcons,
  hi: HiIcons,
  cg: CgIcons,
  vsc: VscIcons,
};

/**
 * Get an icon component from its string name
 * @param iconName - Format: 'FaGithub', 'fa-github', 'github', etc.
 * @param props - Optional props to pass to the icon component (size, className, etc.)
 * @returns React icon component or a fallback icon if not found
 */
export const getIconComponent = (
  iconName: string,
  props: { [key: string]: any } = { size: 20 }
): React.ReactNode => {
  if (!iconName) {
    // Return a default icon if no name provided
    return <FaIcons.FaQuestionCircle {...props} />;
  }

  // First, check if the iconName is already a component name (e.g., "FaGithub")
  if (/^[A-Z][a-z][A-Z]/.test(iconName)) {
    // This looks like a component name already (e.g., FaGithub)
    // Extract the prefix (first two characters, e.g., "Fa")
    const prefix = iconName.substring(0, 2).toLowerCase();
    
    // Get the library based on the prefix
    const library = iconLibraries[prefix as keyof typeof iconLibraries];
    
    if (library && library[iconName as keyof typeof library]) {
      const IconComponent = library[iconName as keyof typeof library];
      return React.createElement(IconComponent as React.ComponentType<any>, props);
    }
  }
  
  // If we reach here, the iconName is not a direct component name or wasn't found
  // Try to parse it as a kebab-case or simple name
  
  // Split the icon name into prefix and name parts
  const parts = iconName.split('-');
  
  // Handle different formats
  let prefix: string;
  let name: string;
  
  if (parts.length === 1) {
    // If only one part, assume it's a FaIcon
    prefix = 'fa';
    name = parts[0];
  } else {
    prefix = parts[0].toLowerCase();
    // Join the rest of the parts with hyphens and convert to camel case
    name = parts.slice(1).join('-');
  }

  // Special case handling for common icon names without prefixes
  const commonIconMap: Record<string, [string, string]> = {
    'github': ['fa', 'github'],
    'linkedin': ['fa', 'linkedin'],
    'twitter': ['fa', 'twitter'],
    'facebook': ['fa', 'facebook'],
    'instagram': ['fa', 'instagram'],
    'youtube': ['fa', 'youtube'],
    'envelope': ['fa', 'envelope'],
    'phone': ['fa', 'phone'],
    'map-marker': ['fa', 'map-marker-alt'],
    'calendar': ['fa', 'calendar-alt'],
  };

  // Check if we have a special mapping for this icon
  if (commonIconMap[iconName.toLowerCase()]) {
    [prefix, name] = commonIconMap[iconName.toLowerCase()];
  }

  // Convert kebab-case to PascalCase for the icon name
  const pascalCaseName = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  // Get the icon library
  const library = iconLibraries[prefix as keyof typeof iconLibraries];
  
  if (!library) {
    console.warn(`Icon library "${prefix}" not found for icon "${iconName}"`);
    return <FaIcons.FaQuestionCircle {...props} />;
  }

  // Try different naming conventions
  const possibleKeys = [
    // Standard format: FaGithub
    `${prefix.charAt(0).toUpperCase() + prefix.slice(1)}${pascalCaseName}`,
    // Alternative format: FaGithubIcon
    `${prefix.charAt(0).toUpperCase() + prefix.slice(1)}${pascalCaseName}Icon`,
    // Just the name: Github
    pascalCaseName,
  ];

  let IconComponent = null;

  // Try each possible key
  for (const key of possibleKeys) {
    const component = library[key as keyof typeof library];
    if (component) {
      IconComponent = component;
      break;
    }
  }
  
  if (!IconComponent) {
    console.warn(`Icon "${pascalCaseName}" not found in library "${prefix}" (tried: ${possibleKeys.join(', ')})`);
    return <FaIcons.FaQuestionCircle {...props} />;
  }

  // Type assertion to ensure it's a valid React component
  return React.createElement(IconComponent as React.ComponentType<any>, props);
};

/**
 * Get multiple icon components from an array of string names
 * @param iconNames - Array of icon names
 * @param props - Optional props to pass to all icon components
 * @returns Array of React icon components
 */
export const getIconComponents = (
  iconNames: string[],
  props: { [key: string]: any } = { size: 20 }
): React.ReactNode[] => {
  return iconNames.map((name, index) => 
    getIconComponent(name, { ...props, key: index })
  );
};
