import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Users } from 'lucide-react';

interface ResumeUploadProps {
  onUpload: () => void;
}

const ResumeUpload = ({ onUpload }: ResumeUploadProps) => {
  const [candidateName, setCandidateName] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file",
          variant: "destructive"
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !candidateName) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Upload file to storage
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create resume record
      const { data: resumeData, error: insertError } = await supabase
        .from('resumes')
        .insert({
          candidate_name: candidateName,
          location,
          resume_file: fileName
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      // Trigger document parsing
      try {
        const { error: parseError } = await supabase.functions.invoke('parse-document', {
          body: {
            filePath: fileName,
            bucketName: 'resumes',
            documentId: resumeData.id,
            documentType: 'resume'
          }
        });

        if (parseError) {
          console.error('Parse error:', parseError);
          toast({
            title: "Document uploaded",
            description: "Resume uploaded successfully, but document parsing failed. You may need to reparse manually.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success!",
            description: "Resume uploaded and processed successfully"
          });
        }
      } catch (parseError) {
        console.error('Parse function error:', parseError);
        toast({
          title: "Document uploaded",
          description: "Resume uploaded successfully, but document parsing is pending.",
          variant: "default"
        });
      }

      setCandidateName('');
      setLocation('');
      setFile(null);
      onUpload();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload resume",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Upload Resume
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="candidateName">Candidate Name *</Label>
            <Input
              id="candidateName"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. John Doe"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. New York, NY"
            />
          </div>

          <div>
            <Label htmlFor="file">Resume File *</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.docx"
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              Upload PDF or DOCX file
            </p>
          </div>

          <Button type="submit" disabled={isUploading} className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload Resume'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;