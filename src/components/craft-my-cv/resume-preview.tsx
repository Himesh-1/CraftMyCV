'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { ResumeData } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Download,
  Briefcase,
  GraduationCap,
  Wrench,
  FileText,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';

interface ResumePreviewProps {
  data: ResumeData;
  template: 'mit' | 'harvard';
  onTemplateChange: (template: 'mit' | 'harvard') => void;
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
      contactInfo: 'flex justify-center items-center flex-wrap gap-x-4 gap-y-1 text-xs text-black',
      sectionTitle: 'text-lg font-bold font-headline text-black uppercase tracking-wider border-b border-black pb-1 mb-2',
      entryTitle: 'font-bold',
      entrySubtitle: 'italic',
      entryDate: 'text-xs text-black',
      skillsContainer: 'flex flex-wrap gap-2',
      skillBadge: 'bg-black/10 text-black px-2 py-0.5 rounded text-xs',
      descriptionList: 'list-disc pl-5 mt-1 space-y-1',
    },
    harvard: {
      container: 'font-serif text-sm',
      header: 'text-center mb-4',
      fullName: 'text-4xl font-bold font-headline text-black tracking-normal',
      contactInfo: 'flex justify-center items-center flex-wrap gap-x-4 gap-y-1 text-xs text-black',
      sectionTitle: 'text-sm font-bold font-headline text-black uppercase tracking-widest border-b-2 border-black mb-2 mt-4',
      entryTitle: 'font-bold',
      entrySubtitle: 'text-black',
      entryDate: 'font-bold text-xs',
      skillsContainer: 'columns-2 md:columns-3',
      skillBadge: '',
      descriptionList: 'list-disc pl-5 mt-1 space-y-1 text-black',
    },
  };

  const styles = templateStyles[template];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold font-headline">Live Preview</h2>
          <Button
            variant={template === 'mit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTemplateChange('mit')}
          >
            MIT Style
          </Button>
          <Button
            variant={template === 'harvard' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTemplateChange('harvard')}
          >
            Harvard Style
          </Button>
        </div>
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="p-2 md:p-4 lg:p-6">
          <div className={cn('bg-white text-black p-8 shadow-lg w-full aspect-[8.5/11]', styles.container)}>
            {/* Header */}
            <header className={styles.header}>
              <h1 className={styles.fullName}>
                {data.personalDetails.fullName}
              </h1>
              <div className={styles.contactInfo}>
                <span>{data.personalDetails.address}</span>
                <span className="hidden md:inline">|</span>
                <a href={`mailto:${data.personalDetails.email}`} className="hover:underline">{data.personalDetails.email}</a>
                <span className="hidden md:inline">|</span>
                <span>{data.personalDetails.phoneNumber}</span>
                <span className="hidden md:inline">|</span>
                <a href={data.personalDetails.website} target="_blank" rel="noreferrer" className="hover:underline">{data.personalDetails.website}</a>
              </div>
            </header>

            {/* Main Content */}
            <main>
              {/* Summary */}
              {data.summary && (
                <section>
                  <h2 className={styles.sectionTitle}>Summary</h2>
                  <p className="text-sm">{data.summary}</p>
                </section>
              )}

              {/* Work Experience */}
              {data.experience.length > 0 && (
                 <section className="mt-4">
                  <h2 className={styles.sectionTitle}>Experience</h2>
                  <div className="space-y-3">
                    {data.experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className={styles.entryTitle}>{exp.jobTitle}</p>
                            <p className={styles.entrySubtitle}>{exp.company}, {exp.location}</p>
                          </div>
                          <p className={styles.entryDate}>{formatDate(exp.startDate)} - {exp.endDate === 'Present' ? 'Present' : formatDate(exp.endDate)}</p>
                        </div>
                        <ul className={styles.descriptionList}>
                          {exp.description.split('\n').filter(line => line.trim() !== '').map((line, i) => <li key={i}>{line.replace(/^-/, '').trim()}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {data.education.length > 0 && (
                <section className="mt-4">
                  <h2 className={styles.sectionTitle}>Education</h2>
                   <div className="space-y-2">
                    {data.education.map((edu) => (
                      <div key={edu.id}>
                        <div className="flex justify-between items-start">
                           <div>
                            <p className={styles.entryTitle}>{edu.degree}</p>
                            <p className={styles.entrySubtitle}>{edu.institution}, {edu.location}</p>
                          </div>
                          <p className={styles.entryDate}>{formatDate(edu.graduationDate)}</p>
                        </div>
                        {edu.details && <p className="text-xs">{edu.details}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills */}
              {data.skills.length > 0 && (
                <section className="mt-4">
                  <h2 className={styles.sectionTitle}>Skills</h2>
                  <div className={styles.skillsContainer}>
                    {data.skills.map((skill) => (
                      <span key={skill.id} className={styles.skillBadge}>{skill.name}</span>
                    ))}
                  </div>
                </section>
              )}
            </main>
          </div>
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
