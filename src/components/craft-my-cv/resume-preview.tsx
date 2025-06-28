'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ResumeData, ResumeTemplate } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Mail, Phone, Globe, MapPin, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';

interface ResumePreviewProps {
  data: ResumeData;
  template: ResumeTemplate;
  onTemplateChange: (template: ResumeTemplate) => void;
}

export function ResumePreview({
  data,
  template,
  onTemplateChange,
}: ResumePreviewProps) {
  const { toast } = useToast();

  const handleDownload = (format: 'PDF' | 'DOCX') => {
    toast({
      title: 'Feature Coming Soon!',
      description: `${format} download will be available in a future update.`,
    });
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

  const styles = templateStyles[template];

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

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-lg font-semibold font-headline">Live Preview</h2>
          <div className="flex items-center gap-2" role="group">
            <Button
              variant={template === 'mit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTemplateChange('mit')}
            >
              MIT
            </Button>
            <Button
              variant={template === 'harvard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTemplateChange('harvard')}
            >
              Harvard
            </Button>
            <Button
              variant={template === 'classic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTemplateChange('classic')}
            >
              Classic
            </Button>
            <Button
              variant={template === 'modern' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTemplateChange('modern')}
            >
              Modern
            </Button>
          </div>
        </div>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="p-2 md:p-4 lg:p-6 bg-muted/50 flex justify-center">
          {template === 'modern'
            ? renderModernTemplate()
            : renderStandardTemplate()}
        </CardContent>
      </ScrollArea>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" onClick={() => handleDownload('PDF')}>
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </Button>
        <Button onClick={() => handleDownload('DOCX')}>
          <Download className="mr-2 h-4 w-4" /> Download DOCX
        </Button>
      </CardFooter>
    </Card>
  );
}
