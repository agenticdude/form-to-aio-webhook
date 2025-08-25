import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VoiceConfigData {
  voiceType: string;
  brandVoice: string;
  contentStructure: string;
}

const VoiceConfigForm = () => {
  const [formData, setFormData] = useState<VoiceConfigData>({
    voiceType: '',
    brandVoice: '',
    contentStructure: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSelectChange = (field: keyof VoiceConfigData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.voiceType || !formData.brandVoice || !formData.contentStructure) {
      toast({
        title: "Missing Information",
        description: "Please select an option for all three forms.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://n8n.dev.aioapp.com/webhook-test/6ea1b457-5d59-41be-8dda-b588521c5a7b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voice_type: formData.voiceType,
          brand_voice: formData.brandVoice,
          content_structure: formData.contentStructure
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Submitted successfully!",
        });
        // Reset form
        setFormData({
          voiceType: '',
          brandVoice: '',
          contentStructure: ''
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const voiceTypeOptions = [
    "Personal Voice (I, Me, My)",
    "Talk to the Reader (You, Your)",
    "Describe Others (He, She, They)",
    "Collective Voice (We, Us, Our)",
    "Professional Voice (No Pronouns)"
  ];

  const brandVoiceOptions = [
    "Professional and Authoritative Brand Voice Characteristics",
    "Tech-Savvy and Innovative Brand Voice",
    "Customer-Centric and Compassionate Brand Voice",
    "Inspirational and Motivational Brand Voice",
    "Storytelling Brand Voice Characteristics"
  ];

  const contentStructureOptions = [
    "Listicle Structure",
    "How to guide blog",
    "Comparison",
    "Problem Solution",
    "Ultimate Guide",
    "Pros and Cons",
    "What's in it for Me?",
    "Myth-Busting"
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-card/80 backdrop-blur-sm border-primary/20 shadow-elegant">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Configure Your Content Voice
          </CardTitle>
          <CardDescription className="text-muted-foreground text-lg">
            Customize your content's voice, brand style, and structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Voice Type Form */}
              <div className="space-y-3">
                <Label htmlFor="voice-type" className="text-base font-semibold text-foreground">
                  Voice Type
                </Label>
                <Select onValueChange={(value) => handleSelectChange('voiceType', value)} value={formData.voiceType}>
                  <SelectTrigger className="h-12 bg-background/50 border-primary/20 hover:border-primary/40 transition-colors">
                    <SelectValue placeholder="Select voice type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-sm border-primary/20">
                    {voiceTypeOptions.map((option) => (
                      <SelectItem key={option} value={option} className="hover:bg-primary/10">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Voice Style Form */}
              <div className="space-y-3">
                <Label htmlFor="brand-voice" className="text-base font-semibold text-foreground">
                  Brand Voice Style
                </Label>
                <Select onValueChange={(value) => handleSelectChange('brandVoice', value)} value={formData.brandVoice}>
                  <SelectTrigger className="h-12 bg-background/50 border-primary/20 hover:border-primary/40 transition-colors">
                    <SelectValue placeholder="Select brand voice" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-sm border-primary/20">
                    {brandVoiceOptions.map((option) => (
                      <SelectItem key={option} value={option} className="hover:bg-primary/10">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Content Structure Form */}
              <div className="space-y-3">
                <Label htmlFor="content-structure" className="text-base font-semibold text-foreground">
                  Content Structure
                </Label>
                <Select onValueChange={(value) => handleSelectChange('contentStructure', value)} value={formData.contentStructure}>
                  <SelectTrigger className="h-12 bg-background/50 border-primary/20 hover:border-primary/40 transition-colors">
                    <SelectValue placeholder="Select structure" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-sm border-primary/20">
                    {contentStructureOptions.map((option) => (
                      <SelectItem key={option} value={option} className="hover:bg-primary/10">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="px-12 py-3 text-lg font-semibold bg-gradient-primary hover:shadow-glow transition-all duration-300 hover-scale"
              >
                {isSubmitting ? "Submitting..." : "Submit Configuration"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceConfigForm;