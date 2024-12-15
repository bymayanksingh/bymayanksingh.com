import React from 'react';
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiReact,
  SiNodedotjs,
  SiFirebase,
  SiTailwindcss,
  SiGithub,
  SiChromewebstore,
  SiHtml5,
  SiCss3,
  SiVite,
  SiNextdotjs,
  SiVercel,
} from 'react-icons/si';

interface SkillIconProps {
  skill: string;
  className?: string;
}

const skillIconMap: { [key: string]: React.ComponentType } = {
  // Languages
  'javascript': SiJavascript,
  'typescript': SiTypescript,
  'python': SiPython,
  'html': SiHtml5,
  'css': SiCss3,

  // Frontend
  'react': SiReact,
  'react.js': SiReact,
  'next.js': SiNextdotjs,
  'tailwind': SiTailwindcss,
  'tailwindcss': SiTailwindcss,

  // Backend & Tools
  'node': SiNodedotjs,
  'node.js': SiNodedotjs,
  'firebase': SiFirebase,
  'github': SiGithub,
  'chrome extension': SiChromewebstore,
  'vite': SiVite,
  'vercel': SiVercel,
};

export function SkillIcon({ skill, className = '' }: SkillIconProps) {
  const normalizedSkill = skill.toLowerCase().trim();
  const Icon = skillIconMap[normalizedSkill];

  if (!Icon) {
    return null;
  }

  return (
    <div className={`inline-flex items-center ${className}`} title={skill}>
      <Icon className="w-5 h-5" />
    </div>
  );
}
