-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('job-descriptions', 'job-descriptions', false),
  ('resumes', 'resumes', false);

-- Create job_descriptions table
CREATE TABLE public.job_descriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description_file TEXT,
  parsed_text TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resumes table
CREATE TABLE public.resumes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_name TEXT NOT NULL,
  resume_file TEXT,
  parsed_text TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create matches table
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.job_descriptions(id) ON DELETE CASCADE,
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  verdict TEXT CHECK (verdict IN ('High', 'Medium', 'Low')),
  missing_skills TEXT[],
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "Anyone can view job descriptions" 
ON public.job_descriptions FOR SELECT USING (true);

CREATE POLICY "Anyone can create job descriptions" 
ON public.job_descriptions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update job descriptions" 
ON public.job_descriptions FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete job descriptions" 
ON public.job_descriptions FOR DELETE USING (true);

CREATE POLICY "Anyone can view resumes" 
ON public.resumes FOR SELECT USING (true);

CREATE POLICY "Anyone can create resumes" 
ON public.resumes FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update resumes" 
ON public.resumes FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete resumes" 
ON public.resumes FOR DELETE USING (true);

CREATE POLICY "Anyone can view matches" 
ON public.matches FOR SELECT USING (true);

CREATE POLICY "Anyone can create matches" 
ON public.matches FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update matches" 
ON public.matches FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete matches" 
ON public.matches FOR DELETE USING (true);

-- Storage policies
CREATE POLICY "Anyone can view job description files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'job-descriptions');

CREATE POLICY "Anyone can upload job description files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'job-descriptions');

CREATE POLICY "Anyone can update job description files" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'job-descriptions');

CREATE POLICY "Anyone can delete job description files" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'job-descriptions');

CREATE POLICY "Anyone can view resume files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'resumes');

CREATE POLICY "Anyone can upload resume files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Anyone can update resume files" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'resumes');

CREATE POLICY "Anyone can delete resume files" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'resumes');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_job_descriptions_updated_at
  BEFORE UPDATE ON public.job_descriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_matches_job_id ON public.matches(job_id);
CREATE INDEX idx_matches_resume_id ON public.matches(resume_id);
CREATE INDEX idx_matches_score ON public.matches(score);
CREATE INDEX idx_resumes_candidate_name ON public.resumes(candidate_name);
CREATE INDEX idx_job_descriptions_title ON public.job_descriptions(title);