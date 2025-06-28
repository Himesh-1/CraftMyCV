
'use client';

import { useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ResumeData, ResumeTemplate } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Download,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';
import { generateDocx } from '@/app/actions';

interface ResumePreviewProps {
  data: ResumeData;
  template: ResumeTemplate;
  onTemplateChange: (template: ResumeTemplate) => void;
}

const templates: { id: ResumeTemplate; name: string }[] = [
  { id: 'modern', name: 'Modern' },
  { id: 'classic', name: 'Classic' },
  { id: 'mit', name: 'MIT' },
  { id: 'harvard', name: 'Harvard' },
  { id: 'ats-classic', name: 'ATS Classic' },
  { id: 'ui-ux', name: 'UI/UX' },
  { id: 'medical', name: 'Medical' },
  { id: 'project-manager', name: 'Project Manager' },
  { id: 'copyeditor', name: 'Copyeditor' },
];

export function ResumePreview({
  data,
  template,
  onTemplateChange,
}: ResumePreviewProps) {
  const { toast } = useToast();
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (format: 'PDF' | 'DOCX') => {
    setIsDownloading(true);
    const element = resumeRef.current;
    if (!element) {
      toast({
        title: 'Download Error',
        description: 'Could not find the resume content to download.',
        variant: 'destructive',
      });
      setIsDownloading(false);
      return;
    }

    if (format === 'PDF') {
      try {
        const { default: html2pdf } = await import('html2pdf.js');
        const opt = {
          margin: 0,
          filename: `${data.personalDetails.fullName.replace(/\s+/g, '-')}-Resume.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };
        toast({
          title: 'Generating PDF...',
          description: 'Your download will begin shortly.',
        });
        await html2pdf().from(element).set(opt).save();
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast({
          title: 'PDF Generation Failed',
          description: (error as Error).message || 'An error occurred.',
          variant: 'destructive',
        });
      } finally {
        setIsDownloading(false);
      }
    } else if (format === 'DOCX') {
      try {
        toast({
          title: 'Generating DOCX...',
          description:
            'Your download will begin shortly. Note: Styling may differ.',
        });

        const base64 = await generateDocx(element.outerHTML);

        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.personalDetails.fullName.replace(/\s+/g, '-')}-Resume.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error generating DOCX:', error);
        toast({
          title: 'DOCX Generation Failed',
          description: (error as Error).message,
          variant: 'destructive',
        });
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      });
    } catch {
      return dateString;
    }
  };

  const formatAtsDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return `${date
        .toLocaleString('en-US', { month: 'long' })
        .toUpperCase()} ${date.getFullYear()}`;
    } catch {
      return dateString.toUpperCase();
    }
  };

  const templateStyles = {
    mit: {
      container: 'font-sans text-sm',
      header: 'text-center border-b-2 border-black pb-2 mb-4',
      fullName: 'text-3xl font-bold font-headline text-black tracking-tight',
      contactInfo:
        'flex justify-center items-center flex-wrap gap-x-4 gap-y-1 text-xs text-black',
      sectionTitle:
        'text-lg font-bold font-headline text-black uppercase tracking-wider border-b border-black pb-1 mb-2',
      entryTitle: 'font-bold text-black',
      entrySubtitle: 'italic text-black',
      entryDate: 'text-xs text-black',
      skillsContainer: 'flex flex-wrap gap-2',
      skillBadge: 'bg-black/10 text-black px-2 py-0.5 rounded text-xs',
      descriptionList: 'list-disc pl-5 mt-1 space-y-1 text-black',
    },
    harvard: {
      container: 'font-serif text-sm',
      header: 'text-center mb-4',
      fullName: 'text-4xl font-bold font-headline text-black tracking-normal',
      contactInfo:
        'flex justify-center items-center flex-wrap gap-x-4 gap-y-1 text-xs text-black',
      sectionTitle:
        'text-sm font-bold font-headline text-black uppercase tracking-widest border-b-2 border-black mb-2',
      entryTitle: 'font-bold text-black',
      entrySubtitle: 'text-black',
      entryDate: 'font-bold text-xs text-black',
      skillsContainer: 'columns-2 md:columns-3',
      skillBadge: 'text-black',
      descriptionList: 'list-disc pl-5 mt-1 space-y-1 text-black',
    },
    classic: {
      container: 'font-serif',
      header: 'text-center py-4 border-b-4 border-black',
      fullName: 'text-4xl font-bold tracking-widest text-black uppercase',
      contactInfo: 'text-center text-xs space-x-4 mt-2 text-black',
      sectionTitle:
        'text-xl font-bold text-black mb-2 border-b border-black pb-1',
      entryTitle: 'font-bold text-black',
      entrySubtitle: 'italic text-black',
      entryDate: 'text-sm text-black',
      skillsContainer: 'flex flex-wrap gap-x-4 gap-y-1',
      skillBadge: 'text-black',
      descriptionList: 'list-disc pl-6 mt-1 space-y-1 text-black',
    },
    modern: {
      container: 'font-sans text-sm flex',
      sectionTitle: 'text-lg font-bold uppercase text-black mb-2 tracking-wider',
      entryTitle: 'font-semibold text-black',
      entrySubtitle: 'text-sm text-black',
      entryDate: 'text-xs text-black font-medium',
      skillsContainer: 'flex flex-wrap gap-2',
      skillBadge: 'bg-black/10 text-black px-2 py-1 rounded text-xs',
      descriptionList: 'list-disc pl-5 mt-1 space-y-1 text-black',
    },
  };

  const styles = templateStyles[template] || {};

  const renderMainContent = () => (
    <main className="mt-4 space-y-4">
      {data.summary && (
        <section>
          <h2 className={styles.sectionTitle}>Summary</h2>
          <p className="text-sm">{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section>
          <h2 className={styles.sectionTitle}>Experience</h2>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={styles.entryTitle}>{exp.jobTitle}</p>
                    <p className={styles.entrySubtitle}>
                      {exp.company}, {exp.location}
                    </p>
                  </div>
                  <p className={styles.entryDate}>
                    {formatDate(exp.startDate)} -{' '}
                    {exp.endDate === 'Present'
                      ? 'Present'
                      : formatDate(exp.endDate)}
                  </p>
                </div>
                <ul className={styles.descriptionList}>
                  {exp.description
                    .split('\n')
                    .filter((line) => line.trim() !== '')
                    .map((line, i) => (
                      <li key={i}>{line.replace(/^-/, '').trim()}</li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section>
          <h2 className={styles.sectionTitle}>Education</h2>
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={styles.entryTitle}>{edu.degree}</p>
                    <p className={styles.entrySubtitle}>
                      {edu.institution}, {edu.location}
                    </p>
                  </div>
                  <p className={styles.entryDate}>
                    {formatDate(edu.graduationDate)}
                  </p>
                </div>
                {edu.details && <p className="text-xs">{edu.details}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <div className={styles.skillsContainer}>
            {data.skills.map((skill) => (
              <span key={skill.id} className={styles.skillBadge}>
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </main>
  );

  const renderModernTemplate = () => (
    <div
      className={cn(
        'bg-white text-black shadow-lg w-full aspect-[8.5/11]',
        styles.container
      )}
    >
      <aside className="w-1/3 bg-gray-100 p-6 flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-headline text-black">
            {data.personalDetails.fullName}
          </h1>
        </div>

        <div>
          <h2 className="font-bold uppercase text-black tracking-widest border-b-2 border-black pb-1 mb-3 text-sm">
            Contact
          </h2>
          <div className="space-y-2 text-xs">
            <p className="flex items-start gap-2">
              <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
              <span>{data.personalDetails.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3 h-3 shrink-0" />
              <span>{data.personalDetails.email}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3 h-3 shrink-0" />
              <span>{data.personalDetails.phoneNumber}</span>
            </p>
            <p className="flex items-center gap-2">
              <Globe className="w-3 h-3 shrink-0" />
              <span>{data.personalDetails.website}</span>
            </p>
          </div>
        </div>

        {data.skills.length > 0 && (
          <div>
            <h2 className="font-bold uppercase text-black tracking-widest border-b-2 border-black pb-1 mb-3 text-sm">
              Skills
            </h2>
            <div className={styles.skillsContainer}>
              {data.skills.map((skill) => (
                <span key={skill.id} className={styles.skillBadge}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      <main className="w-2/3 p-6 space-y-4">
        {data.summary && (
          <section>
            <h2 className={styles.sectionTitle}>Summary</h2>
            <p className="text-xs">{data.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>Experience</h2>
            <div className="space-y-3">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={styles.entryTitle}>{exp.jobTitle}</p>
                      <p className={styles.entrySubtitle}>
                        {exp.company}, {exp.location}
                      </p>
                    </div>
                    <p className={styles.entryDate}>
                      {formatDate(exp.startDate)} -{' '}
                      {exp.endDate === 'Present'
                        ? 'Present'
                        : formatDate(exp.endDate)}
                    </p>
                  </div>
                  <ul className={cn(styles.descriptionList, 'text-xs')}>
                    {exp.description
                      .split('\n')
                      .filter((line) => line.trim() !== '')
                      .map((line, i) => (
                        <li key={i}>{line.replace(/^-/, '').trim()}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>Education</h2>
            <div className="space-y-2">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={styles.entryTitle}>{edu.degree}</p>
                      <p className={styles.entrySubtitle}>
                        {edu.institution}, {edu.location}
                      </p>
                    </div>
                    <p className={styles.entryDate}>
                      {formatDate(edu.graduationDate)}
                    </p>
                  </div>
                  {edu.details && <p className="text-xs">{edu.details}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );

  const renderStandardTemplate = () => (
    <div
      className={cn(
        'bg-white text-black p-8 shadow-lg w-full aspect-[8.5/11]',
        styles.container
      )}
    >
      <header className={styles.header}>
        <h1 className={styles.fullName}>{data.personalDetails.fullName}</h1>
        <div className={styles.contactInfo}>
          <span>{data.personalDetails.address}</span>
          <span className="hidden md:inline"> | </span>
          <a
            href={`mailto:${data.personalDetails.email}`}
            className="hover:underline"
          >
            {data.personalDetails.email}
          </a>
          <span className="hidden md:inline"> | </span>
          <span>{data.personalDetails.phoneNumber}</span>
          <span className="hidden md:inline"> | </span>
          <a
            href={data.personalDetails.website}
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            {data.personalDetails.website}
          </a>
        </div>
      </header>
      {renderMainContent()}
    </div>
  );

  const renderAtsClassicTemplate = () => (
    <div className="bg-white text-black p-8 font-sans w-full aspect-[8.5/11] shadow-lg">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">
          {data.personalDetails.title}
        </h1>
        <p className="text-base">{data.summary}</p>
      </header>

      <section className="mb-6">
        <h2 className="text-xl font-bold border-b-2 border-black pb-2 mb-4">
          Experience
        </h2>
        {data.experience.map((exp) => (
          <div className="mb-4" key={exp.id}>
            <div className="flex justify-between items-start mb-1 text-sm">
              <span className="font-bold">
                {formatAtsDate(exp.startDate)} –{' '}
                {exp.endDate === 'Present'
                  ? 'PRESENT'
                  : formatAtsDate(exp.endDate)}
              </span>
              <span className="font-medium">{exp.location}</span>
            </div>
            <h3 className="text-lg font-bold">
              {exp.jobTitle} | {exp.company}
            </h3>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
              {exp.description
                .split('\n')
                .filter((line) => line.trim())
                .map((line, i) => (
                  <li key={i}>{line.replace(/^-/, '').trim()}</li>
                ))}
            </ul>
          </div>
        ))}
      </section>

      {data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-black pb-2 mb-4">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span
                key={skill.id}
                className="bg-gray-100 text-black px-3 py-1 rounded text-sm"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="mb-6">
        <h2 className="text-xl font-bold border-b-2 border-black pb-2 mb-4">
          Education
        </h2>
        {data.education.map((edu) => (
          <div key={edu.id}>
            <div className="flex justify-between items-start mb-1 text-sm">
              <span className="font-bold">
                {formatAtsDate(edu.graduationDate)}
              </span>
              <span className="font-medium">{edu.location}</span>
            </div>
            <h3 className="text-lg font-bold">
              {edu.degree} | {edu.institution}
            </h3>
            {edu.details && <p className="mt-1 text-sm">{edu.details}</p>}
          </div>
        ))}
      </section>

      {data.activities && (
        <section>
          <h2 className="text-xl font-bold border-b-2 border-black pb-2 mb-4">
            Activities
          </h2>
          <p className="italic text-sm">{data.activities}</p>
        </section>
      )}
    </div>
  );

  const renderUiUxTemplate = () => {
    const nameParts = data.personalDetails.fullName.split(' ');
    const lastName = nameParts.pop() || '';
    const firstName = nameParts.join(' ');

    return (
      <div className="bg-white text-gray-800 p-8 font-sans w-full aspect-[8.5/11] shadow-lg text-gray-800">
        {/* Header */}
        <div className="grid grid-cols-5 gap-8 mb-8 border-b-2 border-gray-200 pb-6">
          <div className="col-span-3">
            <h1 className="text-4xl font-bold">
              {firstName} <span className="text-blue-600">{lastName}</span>
            </h1>
            <h2 className="text-2xl text-gray-600">
              {data.personalDetails.title}
            </h2>
          </div>
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-2">Contact</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center">
                <span className="w-24 font-medium">Email:</span>
                <span>{data.personalDetails.email}</span>
              </li>
              <li className="flex items-center">
                <span className="w-24 font-medium">Phone:</span>
                <span>{data.personalDetails.phoneNumber}</span>
              </li>
              <li className="flex items-center">
                <span className="w-24 font-medium">Portfolio:</span>
                <span>{data.personalDetails.website}</span>
              </li>
              <li className="flex items-center">
                <span className="w-24 font-medium">Location:</span>
                <span>{data.personalDetails.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-5 gap-8">
          {/* Left Column */}
          <div className="col-span-3">
            {/* Objective */}
            <section className="mb-8">
              <h3 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
                Objective
              </h3>
              <p className="text-sm">{data.summary}</p>
            </section>

            {/* Experience */}
            <section className="mb-8">
              <h3 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
                Experience
              </h3>

              {data.experience.map((exp) => (
                <div className="mb-6" key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-lg font-semibold">{exp.jobTitle}</h4>
                    <span className="text-gray-600 text-sm">
                      {formatDate(exp.startDate)} -{' '}
                      {exp.endDate === 'Present'
                        ? 'Present'
                        : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="italic text-sm mb-1">
                    {exp.company}, {exp.location}
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {exp.description
                      .split('\n')
                      .filter((line) => line.trim())
                      .map((line, i) => (
                        <li key={i}>{line.replace(/^-/, '').trim()}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </section>
          </div>

          {/* Right Column */}
          <div className="col-span-2">
            {/* About Me */}
            {data.aboutMe && (
              <section className="mb-8">
                <h3 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
                  About Me
                </h3>
                <p className="text-sm">{data.aboutMe}</p>
              </section>
            )}

            {/* Education */}
            <section className="mb-8">
              <h3 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
                Education
              </h3>
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h4 className="font-semibold">
                    {edu.institution}, {formatDate(edu.graduationDate)}
                  </h4>
                  <p className="text-sm">{edu.degree}</p>
                  {edu.details && <p className="text-xs">{edu.details}</p>}
                </div>
              ))}
            </section>

            {/* Skills */}
            <section>
              <h3 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
                Skills
              </h3>
              <ul className="space-y-2 text-sm">
                {data.skills.map((skill) => (
                  <li key={skill.id} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{skill.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    );
  };

  const renderMedicalTemplate = () => (
    <div className="bg-white text-gray-800 p-8 font-sans w-full aspect-[8.5/11] shadow-lg">
      {/* Header */}
      <div className="grid grid-cols-3 gap-8 mb-8 border-b-2 border-gray-200 pb-6">
        <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4">Contact</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="font-semibold">Phone:</span>{' '}
              {data.personalDetails.phoneNumber}
            </li>
            <li>
              <span className="font-semibold">Website:</span>{' '}
              {data.personalDetails.website}
            </li>
            <li>
              <span className="font-semibold">Email:</span>{' '}
              {data.personalDetails.email}
            </li>
          </ul>
        </div>
        <div className="col-span-2 text-right">
          <h1 className="text-4xl font-bold">
            {data.personalDetails.fullName}
          </h1>
          <h2 className="text-2xl text-gray-600 mt-2">
            {data.personalDetails.title}
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-2">
          {/* Profile */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold border-b border-gray-300 pb-1 mb-3">
              Profile
            </h2>
            <p className="text-base">{data.summary}</p>
          </section>

          {/* Work Experience */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold border-b border-gray-300 pb-1 mb-3">
              Work Experience
            </h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-6">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-semibold">{exp.jobTitle}</h3>
                  <span className="text-gray-600 text-sm">
                    {formatDate(exp.startDate)} -{' '}
                    {exp.endDate === 'Present'
                      ? 'Present'
                      : formatDate(exp.endDate)}
                  </span>
                </div>
                <h4 className="font-medium">{exp.company}</h4>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                  {exp.description
                    .split('\n')
                    .filter((line) => line.trim())
                    .map((line, i) => (
                      <li key={i}>{line.replace(/^-/, '').trim()}</li>
                    ))}
                </ul>
              </div>
            ))}
          </section>
        </div>

        {/* Right Column */}
        <div className="col-span-1">
          {/* Skills */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold border-b border-gray-300 pb-1 mb-3">
              Skills
            </h2>
            <ul className="space-y-3 text-sm">
              {data.skills.map((skill) => (
                <li key={skill.id} className="flex items-center">
                  <span className="text-yellow-500 mr-2 w-16 tracking-widest">
                    {'★'.repeat(skill.level)}
                    {'☆'.repeat(5 - skill.level)}
                  </span>
                  <span>{skill.name}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Education */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold border-b border-gray-300 pb-1 mb-3">
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{edu.institution}</h3>
                  <span className="text-gray-600 text-sm">
                    {formatDate(edu.graduationDate)}
                  </span>
                </div>
                <p className="text-sm">{edu.degree}</p>
                {edu.details && <p className="text-sm">{edu.details}</p>}
              </div>
            ))}
          </section>

          {/* Hobbies */}
          {data.activities && (
            <section>
              <h2 className="text-2xl font-bold border-b border-gray-300 pb-1 mb-3">
                Hobbies
              </h2>
              <ul className="list-disc pl-5 text-sm">
                {data.activities
                  .split(/•|,/g)
                  .filter((line) => line.trim())
                  .map((line, i) => (
                    <li key={i}>{line.trim()}</li>
                  ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  const renderProjectManagerTemplate = () => (
    <div className="bg-white text-gray-800 p-8 font-sans w-full aspect-[8.5/11] shadow-lg">
      {/* Header */}
      <div className="grid grid-cols-3 gap-8 mb-8 border-b-2 border-gray-200 pb-6">
        <div className="col-span-2">
          <h1 className="text-4xl font-bold">
            {data.personalDetails.fullName}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            {data.personalDetails.title}
          </p>
        </div>
        <div className="col-span-1 text-right">
          <ul className="space-y-1 text-sm">
            <li>{data.personalDetails.address}</li>
            <li>{data.personalDetails.phoneNumber}</li>
            <li>{data.personalDetails.email}</li>
          </ul>
        </div>
      </div>

      {/* Objective */}
      <section className="mb-8">
        <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
          Objective
        </h2>
        <p className="text-sm">{data.summary}</p>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-2">
          {/* Experience */}
          <section className="mb-8">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
              Experience
            </h2>

            {data.experience.map((exp) => (
              <div className="mb-6" key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                  <span className="text-gray-600 text-sm">
                    {formatDate(exp.startDate)} –{' '}
                    {exp.endDate === 'Present'
                      ? 'Present'
                      : formatDate(exp.endDate)}
                  </span>
                </div>
                <h4 className="font-medium">{exp.company}</h4>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                  {exp.description
                    .split('\n')
                    .filter((line) => line.trim())
                    .map((line, i) => (
                      <li key={i}>{line.replace(/^-/, '').trim()}</li>
                    ))}
                </ul>
              </div>
            ))}
          </section>
        </div>

        {/* Right Column */}
        <div className="col-span-1">
          {/* Skills */}
          <section className="mb-8">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
              Skills & Abilities
            </h2>
            <ul className="space-y-2 text-sm">
              {data.skills.map((skill) => (
                <li key={skill.id} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{skill.name}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Education */}
          <section className="mb-8">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <h3 className="font-semibold">{edu.institution}</h3>
                <p className="text-sm">{formatDate(edu.graduationDate)}</p>
                <p className="mt-1">{edu.degree}</p>
                <div className="mt-2 text-sm space-y-1">
                  {edu.details
                    .split('\n')
                    .filter((line) => line.trim())
                    .map((line, i) => (
                      <p
                        key={i}
                        className={
                          line.toLowerCase().includes('coursework')
                            ? 'font-medium'
                            : 'list-item ml-5'
                        }
                      >
                        {line.replace(/^-/, '').trim()}
                      </p>
                    ))}
                </div>
              </div>
            ))}
          </section>

          {/* Leadership */}
          {data.leadership && (
            <section>
              <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
                Leadership
              </h2>
              <p className="text-sm">{data.leadership}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  const renderCopyeditorTemplate = () => (
    <div className="bg-white text-gray-800 p-8 font-serif w-full aspect-[8.5/11] shadow-lg">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          {data.personalDetails.fullName.toUpperCase()}
        </h1>
        <h2 className="text-2xl text-gray-600 mt-2">
          {data.personalDetails.title}
        </h2>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-4 text-sm">
          <span>{data.personalDetails.phoneNumber}</span>
          <span className="text-gray-400">•</span>
          <span>{data.personalDetails.email.toUpperCase()}</span>
          <span className="text-gray-400">•</span>
          <span>{data.personalDetails.address}</span>
        </div>
      </header>

      {/* Objective */}
      <section className="mb-8">
        <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
          Objective
        </h2>
        <p className="text-sm">{data.summary}</p>
      </section>

      {/* Skills */}
      <section className="mb-8">
        <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
          Skills & Abilities
        </h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {data.skills.map((skill) => (
            <li key={skill.id}>{skill.name}</li>
          ))}
        </ul>
      </section>

      {/* Experience */}
      <section className="mb-8">
        <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
          Experience
        </h2>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
              <span className="text-gray-600 text-sm">
                {formatDate(exp.startDate)} –{' '}
                {exp.endDate === 'Present'
                  ? 'Present'
                  : formatDate(exp.endDate)}
              </span>
            </div>
            <h4 className="font-medium">
              {exp.company}, {exp.location}
            </h4>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              {exp.description
                .split('\n')
                .filter((line) => line.trim())
                .map((line, i) => (
                  <li key={i}>{line.replace(/^-/, '').trim()}</li>
                ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="mb-8">
        <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
          Education
        </h2>
        {data.education.map((edu, index) => (
          <div key={edu.id} className={cn(index > 0 && 'mt-4')}>
            <h3 className="text-lg font-semibold">{edu.degree}</h3>
            <p className="font-medium">{edu.institution}</p>
            <p className="text-gray-600 text-sm">
              {formatDate(edu.graduationDate)}
            </p>
            <p className="mt-1 text-sm">{edu.details}</p>
          </div>
        ))}
      </section>

      {/* Leadership */}
      {data.leadership && (
        <section>
          <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
            Leadership
          </h2>
          <p className="text-sm">{data.leadership}</p>
        </section>
      )}
    </div>
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <h2 className="text-lg font-semibold font-headline">Live Preview</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-[180px] justify-between"
            >
              <span>
                {templates.find((t) => t.id === template)?.name ??
                  'Select Template'}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            {templates.map((t) => (
              <DropdownMenuItem key={t.id} onClick={() => onTemplateChange(t.id)}>
                {t.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="p-2 md:p-4 lg:p-6 bg-muted/50 flex justify-center">
          <div ref={resumeRef}>
            {(() => {
              switch (template) {
                case 'project-manager':
                  return renderProjectManagerTemplate();
                case 'medical':
                  return renderMedicalTemplate();
                case 'ui-ux':
                  return renderUiUxTemplate();
                case 'ats-classic':
                  return renderAtsClassicTemplate();
                case 'copyeditor':
                  return renderCopyeditorTemplate();
                case 'modern':
                  return renderModernTemplate();
                default:
                  return renderStandardTemplate();
              }
            })()}
          </div>
        </CardContent>
      </ScrollArea>
      <CardFooter className="justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => handleDownload('PDF')}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Download PDF
        </Button>
        <Button onClick={() => handleDownload('DOCX')} disabled={isDownloading}>
          {isDownloading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Download DOCX
        </Button>
      </CardFooter>
    </Card>
  );
}
