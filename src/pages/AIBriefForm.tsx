import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { AIRecommendation, AIBriefData } from '@/types';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Building2, 
  Target, 
  Palette,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { AIOutputDisplay } from '@/components/AIOutputDisplay';

// Mock AI service - replace with actual API call
const mockGenerateCampaign = async (data: AIBriefData): Promise<AIRecommendation> => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return {
    campaignTitle: `${data.clientDetails.name} - ${data.campaignObjective.objective === 'awareness' ? 'Brand Awareness' : data.campaignObjective.objective === 'consideration' ? 'Engagement' : 'Conversion'} Campaign`,
    headlines: [
      `Discover the Power of ${data.clientDetails.name}`,
      `Transform Your ${data.clientDetails.industry} Experience`,
      `${data.clientDetails.name}: Built for Success`,
    ],
    toneOfVoice: data.creativePreferences.tone,
    channels: [
      { name: 'Meta Ads', budgetAllocation: 40, reasoning: 'High reach and targeting capabilities' },
      { name: 'Google Ads', budgetAllocation: 35, reasoning: 'Strong intent-based targeting' },
      { name: 'LinkedIn', budgetAllocation: 15, reasoning: 'Professional audience alignment' },
      { name: 'TikTok', budgetAllocation: 10, reasoning: 'Growing younger demographic' },
    ],
    visualDirection: `${data.creativePreferences.imageryStyle} imagery with ${data.creativePreferences.colorDirection} color palette. Focus on ${data.creativePreferences.dos.join(', ')}.`,
  };
};

export function AIBriefForm() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { logout, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  
  const [formData, setFormData] = useState<AIBriefData>({
    clientDetails: {
      name: '',
      industry: '',
      website: '',
      competitors: [''],
    },
    campaignObjective: {
      objective: 'awareness',
      targetAudience: '',
      budget: 0,
      duration: '',
    },
    creativePreferences: {
      tone: '',
      imageryStyle: '',
      colorDirection: '',
      dos: [''],
      donts: [''],
    },
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateClientDetails = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      clientDetails: { ...prev.clientDetails, [field]: value },
    }));
  };

  const updateCampaignObjective = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      campaignObjective: { ...prev.campaignObjective, [field]: value },
    }));
  };

  const updateCreativePreferences = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      creativePreferences: { ...prev.creativePreferences, [field]: value },
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    try {
      const recommendation = await mockGenerateCampaign(formData);
      setAiRecommendation(recommendation);
      setCurrentStep(5); // Show results step
    } catch (error) {
      console.error('Error generating campaign:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="clientName">Client Name *</Label>
        <Input
          id="clientName"
          value={formData.clientDetails.name}
          onChange={(e) => updateClientDetails('name', e.target.value)}
          placeholder="e.g., Lumiere Skincare"
          className={isDarkMode ? 'bg-slate-700 border-slate-600' : ''}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="industry">Industry *</Label>
        <Input
          id="industry"
          value={formData.clientDetails.industry}
          onChange={(e) => updateClientDetails('industry', e.target.value)}
          placeholder="e.g., Beauty & Personal Care"
          className={isDarkMode ? 'bg-slate-700 border-slate-600' : ''}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          value={formData.clientDetails.website}
          onChange={(e) => updateClientDetails('website', e.target.value)}
          placeholder="https://example.com"
          className={isDarkMode ? 'bg-slate-700 border-slate-600' : ''}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Key Competitors</Label>
        {formData.clientDetails.competitors.map((competitor, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={competitor}
              onChange={(e) => {
                const newCompetitors = [...formData.clientDetails.competitors];
                newCompetitors[index] = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  clientDetails: { ...prev.clientDetails, competitors: newCompetitors },
                }));
              }}
              placeholder={`Competitor ${index + 1}`}
              className={isDarkMode ? 'bg-slate-700 border-slate-600' : ''}
            />
            {index > 0 && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const newCompetitors = formData.clientDetails.competitors.filter((_, i) => i !== index);
                  setFormData(prev => ({
                    ...prev,
                    clientDetails: { ...prev.clientDetails, competitors: newCompetitors },
                  }));
                }}
              >
                ×
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFormData(prev => ({
              ...prev,
              clientDetails: { 
                ...prev.clientDetails, 
                competitors: [...prev.clientDetails.competitors, ''] 
              },
            }));
          }}
        >
          + Add Competitor
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="objective">Campaign Objective *</Label>
        <Select
          value={formData.campaignObjective.objective}
          onValueChange={(value) => updateCampaignObjective('objective', value)}
        >
          <SelectTrigger className={isDarkMode ? 'bg-slate-700 border-slate-600' : ''}>
            <SelectValue placeholder="Select objective" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="awareness">Brand Awareness</SelectItem>
            <SelectItem value="consideration">Consideration</SelectItem>
            <SelectItem value="conversion">Conversion</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="targetAudience">Target Audience *</Label>
        <Textarea
          id="targetAudience"
          value={formData.campaignObjective.targetAudience}
          onChange={(e) => updateCampaignObjective('targetAudience', e.target.value)}
          placeholder="Describe your target audience (demographics, interests, behaviors...)"
          rows={4}
          className={isDarkMode ? 'bg-slate-700 border-slate-600' : ''}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="budget">Campaign Budget (USD) *</Label>
        <Input
          id="budget"
          type="number"
          value={formData.campaignObjective.budget || ''}
          onChange={(e) => updateCampaignObjective('budget', Number(e.target.value))}
          placeholder="e.g., 50000"
          className={isDarkMode ? 'bg-slate-700 border-slate-600' : ''}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="duration">Campaign Duration *</Label>
        <Input
          id="duration"
          value={formData.campaignObjective.duration}
          onChange={(e) => updateCampaignObjective('duration', e.target.value)}
          placeholder="e.g., 3 months"
          className={isDarkMode ? 'bg-slate-700 border-slate-600' : ''}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tone">Tone of Voice *</Label>
        <Select
          value={formData.creativePreferences.tone}
          onValueChange={(value) => updateCreativePreferences('tone', value)}
        >
          <SelectTrigger className={isDarkMode ? 'bg-slate-700 border-slate-600' : ''}>
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="friendly">Friendly & Approachable</SelectItem>
            <SelectItem value="playful">Playful & Fun</SelectItem>
            <SelectItem value="luxury">Luxury & Sophisticated</SelectItem>
            <SelectItem value="bold">Bold & Edgy</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="imageryStyle">Imagery Style *</Label>
        <Select
          value={formData.creativePreferences.imageryStyle}
          onValueChange={(value) => updateCreativePreferences('imageryStyle', value)}
        >
          <SelectTrigger className={isDarkMode ? 'bg-slate-700 border-slate-600' : ''}>
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lifestyle">Lifestyle Photography</SelectItem>
            <SelectItem value="product">Product-focused</SelectItem>
            <SelectItem value="abstract">Abstract/Illustrated</SelectItem>
            <SelectItem value="minimalist">Minimalist</SelectItem>
            <SelectItem value="vibrant">Vibrant & Colorful</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="colorDirection">Color Direction</Label>
        <Input
          id="colorDirection"
          value={formData.creativePreferences.colorDirection}
          onChange={(e) => updateCreativePreferences('colorDirection', e.target.value)}
          placeholder="e.g., Warm earth tones, Cool blues, Brand colors"
          className={isDarkMode ? 'bg-slate-700 border-slate-600' : ''}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Do's</Label>
        {formData.creativePreferences.dos.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => {
                const newDos = [...formData.creativePreferences.dos];
                newDos[index] = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  creativePreferences: { ...prev.creativePreferences, dos: newDos },
                }));
              }}
              placeholder={`Do ${index + 1}`}
              className={isDarkMode ? 'bg-slate-700 border-slate-600' : ''}
            />
            {index > 0 && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const newDos = formData.creativePreferences.dos.filter((_, i) => i !== index);
                  setFormData(prev => ({
                    ...prev,
                    creativePreferences: { ...prev.creativePreferences, dos: newDos },
                  }));
                }}
              >
                ×
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFormData(prev => ({
              ...prev,
              creativePreferences: { 
                ...prev.creativePreferences, 
                dos: [...prev.creativePreferences.dos, ''] 
              },
            }));
          }}
        >
          + Add Do
        </Button>
      </div>
      
      <div className="space-y-2">
        <Label>Don'ts</Label>
        {formData.creativePreferences.donts.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => {
                const newDonts = [...formData.creativePreferences.donts];
                newDonts[index] = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  creativePreferences: { ...prev.creativePreferences, donts: newDonts },
                }));
              }}
              placeholder={`Don't ${index + 1}`}
              className={isDarkMode ? 'bg-slate-700 border-slate-600' : ''}
            />
            {index > 0 && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const newDonts = formData.creativePreferences.donts.filter((_, i) => i !== index);
                  setFormData(prev => ({
                    ...prev,
                    creativePreferences: { ...prev.creativePreferences, donts: newDonts },
                  }));
                }}
              >
                ×
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setFormData(prev => ({
              ...prev,
              creativePreferences: { 
                ...prev.creativePreferences, 
                donts: [...prev.creativePreferences.donts, ''] 
              },
            }));
          }}
        >
          + Add Don't
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className={`
        rounded-lg p-4 space-y-4
        ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}
      `}>
        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Review Your Brief
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Client Details
            </h4>
            <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              {formData.clientDetails.name} • {formData.clientDetails.industry}
            </p>
            {formData.clientDetails.website && (
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                {formData.clientDetails.website}
              </p>
            )}
          </div>
          
          <div>
            <h4 className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Campaign Objective
            </h4>
            <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              {formData.campaignObjective.objective.charAt(0).toUpperCase() + 
               formData.campaignObjective.objective.slice(1)} • 
              ${formData.campaignObjective.budget.toLocaleString()} • 
              {formData.campaignObjective.duration}
            </p>
          </div>
          
          <div>
            <h4 className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Creative Direction
            </h4>
            <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              {formData.creativePreferences.tone} tone • {formData.creativePreferences.imageryStyle} imagery
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isGenerating}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating Campaign...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Generate AI Campaign Brief
          </>
        )}
      </Button>
    </div>
  );

  const stepTitles = [
    { icon: Building2, title: 'Client Details', description: 'Tell us about the client' },
    { icon: Target, title: 'Campaign Objective', description: 'Define your goals' },
    { icon: Palette, title: 'Creative Preferences', description: 'Set the creative direction' },
    { icon: CheckCircle, title: 'Review & Submit', description: 'Generate your campaign' },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <Sidebar isDarkMode={isDarkMode} user={user} />
      
      <div className="lg:ml-64">
        <Header 
          isDarkMode={isDarkMode} 
          onDarkModeToggle={toggleDarkMode}
          onLogout={logout}
          user={user}
        />
        
        <main className="p-6">
          <div className="max-w-3xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                AI Campaign Brief
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Let AI help you create a comprehensive campaign brief
              </p>
            </div>

            {currentStep === 5 && aiRecommendation ? (
              <AIOutputDisplay 
                recommendation={aiRecommendation}
                isDarkMode={isDarkMode}
                onBack={() => setCurrentStep(1)}
              />
            ) : (
              <Card className={isDarkMode ? 'bg-slate-800 border-slate-700' : ''}>
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    {stepTitles.map((step, index) => {
                      const Icon = step.icon;
                      const isActive = index + 1 === currentStep;
                      const isCompleted = index + 1 < currentStep;
                      
                      return (
                        <div 
                          key={index}
                          className={`
                            flex items-center gap-2
                            ${index < stepTitles.length - 1 ? 'flex-1' : ''}
                          `}
                        >
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center
                            ${isActive 
                              ? 'bg-blue-500 text-white' 
                              : isCompleted 
                                ? 'bg-green-500 text-white'
                                : isDarkMode 
                                  ? 'bg-slate-700 text-slate-400'
                                  : 'bg-gray-200 text-gray-500'
                            }
                          `}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {index < stepTitles.length - 1 && (
                            <div className={`
                              flex-1 h-0.5
                              ${isCompleted 
                                ? 'bg-green-500' 
                                : isDarkMode 
                                  ? 'bg-slate-700' 
                                  : 'bg-gray-200'
                              }
                            `} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <Progress value={progress} className="h-2" />
                  
                  <div className="mt-4">
                    <CardTitle className={isDarkMode ? 'text-white' : ''}>
                      {stepTitles[currentStep - 1].title}
                    </CardTitle>
                    <CardDescription>
                      {stepTitles[currentStep - 1].description}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}
                  {currentStep === 4 && renderStep4()}
                  
                  {currentStep < 4 && (
                    <div className="flex justify-between mt-6">
                      <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button onClick={handleNext}>
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
