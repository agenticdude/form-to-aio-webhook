import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  blogTitle: string;
  seoKeywords: string;
  contentPreference: string;
}

const BlogContentForm = () => {
  const [formData, setFormData] = useState<FormData>({
    blogTitle: "",
    seoKeywords: "",
    contentPreference: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.blogTitle || !formData.seoKeywords || !formData.contentPreference) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://n8n.dev.aioapp.com/webhook-test/5a6f3605-f853-4dee-b751-9d4b657a81bf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogTitle: formData.blogTitle,
          seoKeywords: formData.seoKeywords,
          contentPreference: formData.contentPreference,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your blog content request has been submitted successfully.",
        });
        
        // Reset form
        setFormData({
          blogTitle: "",
          seoKeywords: "",
          contentPreference: "",
        });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Content</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="blogTitle" className="text-sm font-medium text-foreground">
                Blog Title
              </Label>
              <Input
                id="blogTitle"
                type="text"
                placeholder="Enter your blog title"
                value={formData.blogTitle}
                onChange={(e) => handleInputChange("blogTitle", e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoKeywords" className="text-sm font-medium text-foreground">
                Seo Keywords
              </Label>
              <Input
                id="seoKeywords"
                type="text"
                placeholder="Enter SEO keywords"
                value={formData.seoKeywords}
                onChange={(e) => handleInputChange("seoKeywords", e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentPreference" className="text-sm font-medium text-foreground">
                Content Preference
              </Label>
              <Select
                value={formData.contentPreference}
                onValueChange={(value) => handleInputChange("contentPreference", value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an option ..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  <SelectItem value="ai-generated">Ai Generated</SelectItem>
                  <SelectItem value="web-search">Web Search</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogContentForm;